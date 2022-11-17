import {FileEntity} from "zhangyida-tools";
import {getMediaType, shallowCopy} from "../util/common";

export class FileTagEntity extends FileEntity {
    tag: string[] = []
    selected?: boolean = false
    desc?: string
    isOnline?: boolean;

    static ofJson(json: any): FileTagEntity {
        const fileEntity = super.ofJson(json);
        const fileTagEntity = new FileTagEntity();
        shallowCopy(json, fileTagEntity, ['desc'])
        shallowCopy(fileEntity, fileTagEntity)
        return fileTagEntity;
    }
}

const {FileEntity: File, ListProcess} = require('zhangyida-tools');

function getDataJsonEntityWithDefault(path: string, jsonFileName: string, fileContent = "[]") {
    return File.ofNullable(path, jsonFileName).orElse(() => {
        return File.of(path).createFile(jsonFileName, fileContent);
    });
}

const USER_HOME = process.env.HOME || process.env.USERPROFILE
const TAG_DATA_FILE_NAME = "tagData.json";
const TAG_FILE_NAME = 'tag.json';
const CONFIG_DIR_NAME = "file_tag_config";
const CONFIG_DIR = File.pathJoin(USER_HOME, CONFIG_DIR_NAME);
File.ofNullable(CONFIG_DIR).orElse(() => File.of(File.getParentFolderPathByPath(CONFIG_DIR)).createChildFolder(CONFIG_DIR_NAME))
export const DATA_JSON_ENTITY = getDataJsonEntityWithDefault(CONFIG_DIR, TAG_DATA_FILE_NAME);
export const TAG_DATA_ENTITY = getDataJsonEntityWithDefault(CONFIG_DIR, TAG_FILE_NAME);

export function fileEqual(file1: any, file2: any) {
    return file1.filePath === file2.filePath
}

export function filesContains(files: any[], file: any) {
    return files.some(value => {
        return fileEqual(value, file)
    })
}

function getLevel(path: string) {
    return path.split("/").filter(Boolean).length;
}

export const allFiles = ref<FileTagEntity[]>([]);

export function getDbData() {
    // object.forEach(value => {
    //     // @ts-ignore
    //     value.tag = value.tag.filter(Boolean)
    // })
    if (allFiles.value.length === 0) {
        allFiles.value = sortFile(DATA_JSON_ENTITY.json().map((v: FileTagEntity) => FileTagEntity.ofJson(v))) || [];
    }
}

export function getDbTag() {
    const object = TAG_DATA_ENTITY.json() || [];
    return ListProcess.of([...object, "image", "audio", "video"]).unique().toList()
}

export function removeStartWithFile(value: FileTagEntity) {
    allFiles.value = allFiles.value.filter(value1 => !value1.filePath.startsWith(value.filePath))
}

function syncDbData(actual: FileTagEntity[], path: string) {
    getDbData();
    actual.forEach(value => {
        const index = allFiles.value.findIndex((exist: any) => fileEqual(exist, value));
        if (index === -1) {
            value.tag = []
            allFiles.value.push(value)
        } else {
            // if (value.fileName === 'test.txt') {
            // }
            // 将配置中的tag,desc付给实际文件
            shallowCopy(allFiles.value[index], value, ['tag', 'desc'])
            // 将实际的文件名付给配置
            shallowCopy(value, allFiles.value[index], ['fileName'])
        }
    })
    const currentLevel = getLevel(path);
    const isCurrentChildFiles = (value: FileTagEntity) => value.filePath.startsWith(path) && getLevel(value.filePath) === currentLevel + 1;
    /*删除实际中不存在的*/
    allFiles.value.filter(isCurrentChildFiles).forEach(value => {
        const findIndex = actual.findIndex(value1 => fileEqual(value, value1));
        // 不因磁盘不在线而删除
        if (value.isDisk()) {
            if (findIndex === -1) {
                value.isOnline = false;
                actual.push(value)
            } else {
                actual[findIndex].isOnline = true;
                value.isOnline = true
            }
        } else if (findIndex === -1) {
            removeStartWithFile(value);
        }
    })
    writeToDataFile()
}

export type FileEntityProcess = (file: any) => void;

export const updateFileEntity = (file: any, process: FileEntityProcess) => {
    const find = allFiles.value.find(value => fileEqual(file, value));
    process(find);
    writeToDataFile()
}

export const updateFileTagEntities = (files: FileTagEntity[], process: FileEntityProcess) => {
    const filter = allFiles.value.filter(value => filesContains(files, value));
    for (let file of filter) {
        process(file)
    }
    writeToDataFile()
}

const TypeSort = [
    'disk', 'folder', 'file'
]

export function sortFile(actual: FileTagEntity[]) {
    // @ts-ignore
    return actual.sort((a, b) => {
        if (a.type !== b.type) {
            return TypeSort.indexOf(a.type) - TypeSort.indexOf(b.type)
        } else if (a.type === b.type && a.type === 'file') {
            if (a.getNameAndExt()[1] > b.getNameAndExt()[1]) {
                return 1
            } else if (a.getNameAndExt()[1] < b.getNameAndExt()[1]) {
                return -1
            } else {
                if (a.getNameAndExt()[0] > b.getNameAndExt()[0]) {
                    return 1
                } else if (a.getNameAndExt()[0] < b.getNameAndExt()[0]) {
                    return -1
                } else {
                    return 0;
                }
            }
        }
    });
}

export const fetchWithDisk = async (path = "", isFolder?: boolean) => {
    let actual = await File.fetchWithDisk(path, isFolder);
    syncDbData(actual, path);
    actual = sortFile(actual)
    return actual
}

export const OPERATION = {
    MOVE: 'move',
    RENAME: 'rename',
    COPY: 'copy',
}

function copy(element: any) {
    return JSON.parse(JSON.stringify(element));
}

export function writeToDataFile() {
    allFiles.value.forEach(value => {
        // @ts-ignore
        delete value['_removed'];
        // delete value.isOnline;
        delete value.selected;
        const mediaType = getMediaType(value.fileName);
        if (value.isFile() && mediaType && !value.tag.includes(mediaType)) {
            value.tag.push(mediaType)
        }
    })
    DATA_JSON_ENTITY.writeJson(allFiles.value)
}

export function syncDataJson(oldFilePath: string, newFileEntity = new File(), operation = OPERATION.RENAME) {
    const oldPathLevel = getLevel(oldFilePath);
    const childFilesPredicate = (value: FileTagEntity) => value.filePath.startsWith(oldFilePath) && getLevel(value.filePath) > oldPathLevel;
    const dataJson = allFiles.value;
    const findIndex = dataJson.findIndex(value => value.filePath === oldFilePath);

    const replaceOldPath = (value: FileTagEntity) => {
        value.filePath = value.filePath.replace(oldFilePath, newFileEntity.filePath)
    };

    const moveAndRenameFunc = () => {
        if (findIndex !== -1) {
            dataJson[findIndex] = newFileEntity;
            if (newFileEntity.isDirectory()) {
                dataJson.filter(childFilesPredicate).forEach(value => {
                    replaceOldPath(value);
                })
            }
        }
    };
    const map = {
        [OPERATION.RENAME]: moveAndRenameFunc,
        [OPERATION.COPY]: () => {
            if (findIndex !== -1) {
                const copyJson = copy(dataJson[findIndex]);
                copyJson.filePath = newFileEntity.filePath
                copyJson.fileName = newFileEntity.fileName
                dataJson.push(FileTagEntity.ofJson(copyJson))
                if (newFileEntity.isDirectory()) {
                    let copyRelatedJson = dataJson.filter(childFilesPredicate);
                    copyRelatedJson = copy(copyRelatedJson);
                    copyRelatedJson.forEach(value => {
                        replaceOldPath(value)
                    })
                    dataJson.push(...copyRelatedJson)
                }
            }
        },
        [OPERATION.MOVE]: moveAndRenameFunc,
    }

    map[operation]()

    writeToDataFile();
}

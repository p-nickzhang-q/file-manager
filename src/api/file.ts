import {FileEntity} from "zhangyida-tools";

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

function fileEqual(file1: any, file2: any) {
    return file1.filePath === file2.filePath
}

function filesContains(files = [], file: any) {
    return files.some(value => {
        return fileEqual(value, file)
    })
}

function getLevel(path: string) {
    return path.split("/").filter(Boolean).length;
}

export const allFiles = ref<FileEntity[]>([]);

export function getDbData() {
    // @ts-ignore
    const object = sortFile(DATA_JSON_ENTITY.json().map(v => File.ofJson(v))) || [];
    allFiles.value = object;
    return object;
}

export function getDbTag() {
    return TAG_DATA_ENTITY.json() || []
}

function syncDbData(actual: any[], path: string) {
    let dbData = getDbData();
    // @ts-ignore
    actual.forEach(value => {
        const index = dbData.findIndex((exist: any) => fileEqual(exist, value));
        if (index === -1) {
            value.tag = []
            dbData.push(value)
        } else {
            // @ts-ignore
            value.tag = dbData[index].tag
        }
    })
    const currentLevel = getLevel(path);
    // @ts-ignore
    const isCurrentChildFiles = value => value.filePath.startsWith(path) && getLevel(value.filePath) === currentLevel + 1;
    // @ts-ignore
    dbData.filter(isCurrentChildFiles).forEach(value => {
        // @ts-ignore
        const findIndex = actual.findIndex(value1 => fileEqual(value, value1));
        if (findIndex === -1) {
            // @ts-ignore
            dbData = dbData.filter(value1 => !value1.filePath.startsWith(value.filePath))
        }
    })
    writeToDataFile(dbData)
}

export type FileEntityProcess = (file: any) => void;

export const updateFileEntity = (file: any, process: FileEntityProcess) => {
    const dbData = getDbData();
    // @ts-ignore
    const find = dbData.find(value => fileEqual(file, value));
    process(find);
    writeToDataFile(dbData)
}

const TypeSort = [
    'disk', 'folder', 'file'
]

function sortFile(actual: FileEntity[]) {
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
                return 0;
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

function writeToDataFile(dataJson: FileEntity[]) {
    // @ts-ignore
    dataJson.forEach(value => delete value['_removed'])
    DATA_JSON_ENTITY.writeJson(dataJson)
}

export function syncDataJson(oldFilePath: string, newFileEntity = new File(), operation = OPERATION.RENAME) {
    const oldPathLevel = getLevel(oldFilePath);
    // @ts-ignore
    const childFilesPredicate = value => value.filePath.startsWith(oldFilePath) && getLevel(value.filePath) > oldPathLevel;
    const dataJson = getDbData();
    // @ts-ignore
    const findIndex = dataJson.findIndex(value => value.filePath === oldFilePath);

    // @ts-ignore
    const replaceOldPath = value => {
        value.filePath = value.filePath.replace(oldFilePath, newFileEntity.filePath)
    };

    const moveAndRenameFunc = () => {
        if (findIndex !== -1) {
            dataJson[findIndex] = newFileEntity;
            if (newFileEntity.isDirectory()) {
                // @ts-ignore
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
                if (newFileEntity.isDirectory()) {
                    let copyRelatedJson = dataJson.filter(childFilesPredicate);
                    copyRelatedJson = copy(copyRelatedJson);
                    // @ts-ignore
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

    writeToDataFile(dataJson);
}

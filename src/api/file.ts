const {FileEntity} = require('zhangyida-tools');


function getDataJsonEntityWithDefault(path: string, jsonFileName: string, fileContent = "[]") {
    return FileEntity.ofNullable(path, jsonFileName).orElse(() => {
        return FileEntity.of(path).createFile(jsonFileName, fileContent);
    });
}

const USER_HOME = process.env.HOME || process.env.USERPROFILE
const TAG_DATA_FILE_NAME = "tagData.json";
const TAG_FILE_NAME = 'tag.json';
const CONFIG_DIR_NAME = "file_tag_config";
const CONFIG_DIR = FileEntity.pathJoin(USER_HOME, CONFIG_DIR_NAME);
FileEntity.ofNullable(CONFIG_DIR).orElse(() => FileEntity.of(FileEntity.getParentFolderPathByPath(CONFIG_DIR)).createChildFolder(CONFIG_DIR_NAME))
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

function getDbData() {
    return DATA_JSON_ENTITY.json() || [];
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
    DATA_JSON_ENTITY.writeJson(dbData)
}

export type FileEntityProcess = (file: any) => void;

export const updateFileEntity = (file: any, process: FileEntityProcess) => {
    const dbData = getDbData();
    // @ts-ignore
    const find = dbData.find(value => fileEqual(file, value));
    process(find);
    DATA_JSON_ENTITY.writeJson(dbData)
}

export const fetchWithDisk = async (path = "", isFolder?: boolean) => {
    const actual = await FileEntity.fetchWithDisk(path, isFolder);
    syncDbData(actual, path);
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

export function syncDataJson(oldFilePath: string, newFileEntity = new FileEntity(), operation = OPERATION.RENAME) {
    const dataJsonEntity = DATA_JSON_ENTITY
    const oldPathLevel = getLevel(oldFilePath);
    // @ts-ignore
    const childFilesPredicate = value => value.filePath.startsWith(oldFilePath) && getLevel(value.filePath) > oldPathLevel;
    const dataJson = dataJsonEntity.json() || [];
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

    dataJsonEntity.writeJson(dataJson)
}

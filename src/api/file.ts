const {FileEntity} = require('zhangyida-tools');

function getDataJsonEntityWithDefault(path: string, jsonFileName: string, fileContent = "[]") {
    return FileEntity.ofNullable(path, jsonFileName).orElse(() => {
        return FileEntity.of(path).createFile(jsonFileName, fileContent);
    });
}


const USER_HOME = process.env.HOME || process.env.USERPROFILE
const TAG_DATA_FILE_NAME = "tagData.json";
const CONFIG_DIR_NAME = "file_tag_config";
const CONFIG_DIR = FileEntity.pathJoin(USER_HOME, CONFIG_DIR_NAME);
FileEntity.ofNullable(CONFIG_DIR).orElse(() => FileEntity.of(FileEntity.getParentFolderPathByPath(CONFIG_DIR)).createChildFolder(CONFIG_DIR_NAME))
const DATA_JSON_ENTITY = getDataJsonEntityWithDefault(CONFIG_DIR, TAG_DATA_FILE_NAME);

export const fetchWithDisk = async (path?: string, isFolder?: boolean) => {
    const fileEntities = await FileEntity.fetchWithDisk(path, isFolder);

    return fileEntities
}

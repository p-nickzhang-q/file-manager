import {MouseOptionParam, toWindowPath} from "../../util/common";
import {FileEntity} from "zhangyida-tools";
import {OPERATION, syncDataJson} from "../../api/file";

const {dialog} = require("@electron/remote");

export const useCopy = ({getData, currentPath}: MouseOptionParam) => {
    const copyFile = ref<FileEntity>();

    const openCopy = async (t: FileEntity) => {
        const strings = dialog.showOpenDialogSync({
            title: "复制",
            defaultPath: toWindowPath(t.getParentFolderPath()),
            properties: ["openDirectory"],
            buttonLabel: '选择'
        });
        if (strings) {
            const oldPath = t.filePath;
            copyFile.value = t
            copyFile.value?.copy(strings[0])
            syncDataJson(oldPath, copyFile.value, OPERATION.COPY)
            await getData(currentPath.value)
        }

    };
    return {copyFile, openCopy};
}

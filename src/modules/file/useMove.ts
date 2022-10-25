import {ref} from "vue";
import {MouseOptionParam, toWindowPath} from "../../util/common";
import {FileEntity} from "zhangyida-tools";
import {OPERATION, syncDataJson} from "../../api/file";

const {dialog} = require("@electron/remote");

export const useMove = ({getData, currentPath}: MouseOptionParam) => {
    const moveFile = ref<FileEntity>();
    const openMove = async (t: FileEntity) => {
        const strings = dialog.showOpenDialogSync({
            title: "移动",
            defaultPath: toWindowPath(t.getParentFolderPath()),
            properties: ["openDirectory"],
            buttonLabel: '选择'
        });
        if (strings) {
            const oldPath = t.filePath;
            moveFile.value = t
            moveFile.value?.move(strings[0])
            syncDataJson(oldPath, moveFile.value, OPERATION.MOVE)
            await getData(currentPath.value)
        }
    };
    return {moveFile, openMove};
};

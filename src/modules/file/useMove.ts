import {ref} from "vue";
import {MouseOptionParam} from "../../util/common";
import {FileEntity} from "zhangyida-tools";

const {dialog} = require("@electron/remote");

export const useMove = ({getData, currentPath}: MouseOptionParam) => {
    const moveFile = ref<FileEntity>();
    const openMove = async (t: FileEntity) => {
        const strings = dialog.showOpenDialogSync({
            title: "移动",
            properties: ["openDirectory"],
            buttonLabel: '选择'
        });
        if (strings) {
            moveFile.value = t
            moveFile.value?.move(strings[0])
            await getData(currentPath.value)
        }
    };
    return {moveFile, openMove};
};

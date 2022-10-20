import {ref} from "vue";
import {MouseOptionParam} from "../../util/common";
import {FileEntity} from "zhangyida-tools";

const {dialog} = require("@electron/remote");

export const useCopy = ({getData, currentPath}: MouseOptionParam) => {
    const copyFile = ref<FileEntity>();

    const openCopy = async (t: FileEntity) => {
        const strings = dialog.showOpenDialogSync({
            title: "复制",
            properties: ["openDirectory"],
            buttonLabel: '选择'
        });
        if (strings) {
            copyFile.value = t
            copyFile.value?.copy(strings[0])
            await getData(currentPath.value)
        }

    };
    return {copyFile, openCopy};
}

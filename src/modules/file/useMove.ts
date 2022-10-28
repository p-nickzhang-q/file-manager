import {MouseOptionParam, toWindowPath} from "../../util/common";
import {FileEntity} from "zhangyida-tools";
import {OPERATION, syncDataJson} from "../../api/file";
import {ElNotification} from "element-plus";

const {dialog} = require("@electron/remote");

export const useMove = ({getData, currentPath}: MouseOptionParam) => {
    const openMove = async (t: FileEntity[]) => {
        let defaultPath: string;
        if (t.length === 1) {
            defaultPath = toWindowPath(t[0].getParentFolderPath());
        }
        const strings = dialog.showOpenDialogSync({
            title: "移动",
            // @ts-ignore
            defaultPath,
            properties: ["openDirectory"],
            buttonLabel: '选择'
        });
        if (strings) {
            for (let fileEntity of t) {
                try {
                    const oldPath = fileEntity.filePath;
                    fileEntity.move(strings[0])
                    syncDataJson(oldPath, fileEntity, OPERATION.MOVE)
                } catch (e) {
                    if (e) {
                        // @ts-ignore
                        ElNotification.error({message: e.message, duration: 2000})
                        console.error(e);
                    }
                }
            }
            await getData(currentPath.value)
        }
    };
    return {openMove};
};

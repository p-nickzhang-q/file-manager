import {MouseOptionParam, toWindowPath} from "../../util/common";
import {FileTagEntity, OPERATION, syncDataJson} from "../../api/file";

const {dialog} = require("@electron/remote");

export const useCopy = ({getData, currentPath}: MouseOptionParam) => {

    const openCopy = async (t: FileTagEntity[]) => {
        let defaultPath: string;
        if (t.length === 1) {
            defaultPath = toWindowPath(t[0].getParentFolderPath());
        }

        const strings = dialog.showOpenDialogSync({
            title: "复制",
            // @ts-ignore
            defaultPath,
            properties: ["openDirectory"],
            buttonLabel: '选择'
        });
        if (strings) {
            for (let fileEntity of t) {
                const oldPath = fileEntity.filePath;
                fileEntity.copy(strings[0])
                syncDataJson(oldPath, fileEntity, OPERATION.COPY)
            }
            await getData(currentPath.value)
        }

    };
    return {openCopy};
}

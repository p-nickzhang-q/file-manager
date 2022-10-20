import {FileEntity} from "zhangyida-tools";

const {BrowserWindow, Menu} = require("@electron/remote");


export default function () {
    const target = ref<FileEntity>();

    // @ts-ignore
    const buildMouseMenu = ({openRename, openMove, openCopy}) => {
        return Menu.buildFromTemplate([
            {
                label: '重命名', click() {
                    openRename(target.value)
                }
            },
            {
                label: '移动', click() {
                    openMove(target.value)
                }
            },
            {
                label: '复制', click() {
                    openCopy(target.value)
                }
            },
            {label: '删除'},
            {label: '新标签打开'},
        ]);
    };

    // @ts-ignore
    const popup = (menu: Menu, item: FileEntity) => {
        target.value = item
        menu.popup({
            // @ts-ignore
            window: BrowserWindow.getFocusedWindow()
        })
    };

    return {
        buildMouseMenu, popup
    }
}




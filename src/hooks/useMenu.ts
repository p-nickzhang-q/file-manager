import {FileEntity} from "zhangyida-tools";

const {BrowserWindow, Menu} = require("@electron/remote");

export default function () {
    const target = ref<FileEntity>();

    // @ts-ignore
    const buildMouseMenu = ({openRename, openMove, openCopy, handleDelete, openNewTap}) => {
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
            {
                label: '删除', click() {
                    handleDelete(target.value)
                }
            },
            {
                label: '新标签打开', id: "openNewTab", click() {
                    openNewTap(target.value)
                }
            },
        ]);
    };

    // @ts-ignore
    const popup = (menu: Menu, item: FileEntity) => {
        target.value = item
        const menuItem = menu.getMenuItemById('openNewTab');
        menuItem.visible = !item.isFile();
        menu.popup({
            // @ts-ignore
            window: BrowserWindow.getFocusedWindow()
        })
    };

    return {
        buildMouseMenu, popup
    }
}




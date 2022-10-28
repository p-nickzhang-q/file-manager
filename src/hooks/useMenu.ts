import {FileEntity} from "zhangyida-tools";
import {Menu} from '@electron/remote';

const {BrowserWindow, Menu: MenuC} = require("@electron/remote");

const MenuId = {
    rename: 'rename',
    move: 'move',
    copy: "copy",
    remove: "remove",
    newTab: "newTab",
}

const MenuConfig = {
    folder: [
        ...Object.values(MenuId),
    ],
    disk: [
        MenuId.newTab
    ],
    file: [
        MenuId.rename,
        MenuId.move,
        MenuId.copy,
        MenuId.remove,
    ],
    multi: [
        MenuId.newTab,
        MenuId.move,
        MenuId.copy,
        MenuId.remove,
    ]
}


export default function () {
    const target = ref<FileEntity>();
    const selectedFiles = ref<FileEntity[]>();

    const getProcessFiles = () => {
        if (selectedFiles.value?.length) {
            return selectedFiles.value
        } else {
            return [target.value]
        }
    }

    // @ts-ignore
    const buildMouseMenu = ({openRename, openMove, openCopy, handleDelete, openNewTap}) => {
        return MenuC.buildFromTemplate([
            {
                label: '重命名', id: MenuId.rename, click() {
                    openRename(target.value)
                }
            },
            {
                label: '移动', id: MenuId.move, click() {
                    openMove(getProcessFiles())
                }
            },
            {
                label: '复制', id: MenuId.copy, click() {
                    openCopy(getProcessFiles())
                }
            },
            {
                label: '删除', id: MenuId.remove, click() {
                    handleDelete(getProcessFiles())
                }
            },
            {
                label: '新标签打开', id: MenuId.newTab, click() {
                    openNewTap(getProcessFiles())
                }
            },
        ]);
    };

    // @ts-ignore
    const popup = (menu: Menu, file: FileEntity, files: FileEntity[]) => {
        target.value = file
        selectedFiles.value = files
        // @ts-ignore
        menu.items.forEach(menuItem => {
            if (files.length > 1) {
                menuItem.visible = MenuConfig.multi.includes(menuItem.id)
            } else {
                menuItem.visible = MenuConfig[file.type].includes(menuItem.id)
            }
        })

        menu.popup({
            // @ts-ignore
            window: BrowserWindow.getFocusedWindow()
        })
    };

    return {
        buildMouseMenu, popup
    }
}




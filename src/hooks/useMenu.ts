import {FileEntity} from "zhangyida-tools";
import {Menu} from '@electron/remote';

const {BrowserWindow, Menu: MenuC} = require("@electron/remote");

const MenuId = {
    rename: 'rename',
    move: 'move',
    copy: "copy",
    remove: "remove",
    newTab: "newTab",
    openInFileExplore: 'openInFileExplore',
    bulkAddTag: 'bulkAddTag',
}

const MenuConfig = {
    folder: [
        MenuId.rename,
        MenuId.move,
        MenuId.copy,
        MenuId.remove,
        MenuId.newTab,
        MenuId.openInFileExplore,
        MenuId.bulkAddTag
    ],
    disk: [
        MenuId.newTab,
        MenuId.openInFileExplore,
        MenuId.bulkAddTag
    ],
    file: [
        MenuId.rename,
        MenuId.move,
        MenuId.copy,
        MenuId.remove,
        MenuId.bulkAddTag
    ],
    multi: [
        MenuId.move,
        MenuId.copy,
        MenuId.remove,
        MenuId.bulkAddTag
    ]
}


export default function () {
    const target = ref<FileEntity>();
    const selectedFiles = ref<FileEntity[]>([]);

    const getProcessFiles = () => {
        if (selectedFiles.value?.length > 1) {
            return selectedFiles.value
        } else {
            return [target.value]
        }
    }

    const buildMouseMenu = (config: {
        openRename: any,
        openMove: any,
        openCopy: any,
        handleDelete: any,
        openNewTap: any,
        openInFileExplore: any,
        bulkAddTag: any
    }) => {
        return MenuC.buildFromTemplate([
            {
                label: '重命名', id: MenuId.rename, click() {
                    config.openRename(target.value)
                }
            },
            {
                label: '移动到', id: MenuId.move, click() {
                    config.openMove(getProcessFiles())
                }
            },
            {
                label: '复制到', id: MenuId.copy, click() {
                    config.openCopy(getProcessFiles())
                }
            },
            {
                label: '删除', id: MenuId.remove, click() {
                    config.handleDelete(getProcessFiles())
                }
            },
            {
                label: '新标签打开', id: MenuId.newTab, click() {
                    config.openNewTap(getProcessFiles())
                }
            },
            {
                label: "在文件浏览器中打开", id: MenuId.openInFileExplore, click() {
                    config.openInFileExplore(target.value)
                }
            },
            {
                label: '批量修改', id: MenuId.bulkAddTag, click() {
                    config.bulkAddTag(getProcessFiles())
                }
            }
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




import {FileEntity} from "zhangyida-tools";
import {Menu} from '@electron/remote';
import {allFiles} from "../api/file";
import {exportToJson, exportToXlsx} from "./useFile";

const {BrowserWindow, Menu: MenuClass} = require("@electron/remote");

const MenuId = {
    rename: 'rename',
    move: 'move',
    copy: "copy",
    remove: "remove",
    newTab: "newTab",
    openInFileExplore: 'openInFileExplore',
    bulkAddTag: 'bulkAddTag',
    export2: "export2",
    exportCurrentFolderFiles2Xlsx: "exportCurrentFolderFiles2Xlsx",
    exportCurrentAllFiles2Xlsx: "exportCurrentAllFiles2Xlsx",
    exportAllFiles2Xlsx: "exportAllFiles2Xlsx",
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

export function useContextMenu(config: { getCurrentItems: any, getCurrentPath: any }) {
    const menu = MenuClass.buildFromTemplate([
        {
            label: '导出',
            id: MenuId.export2,
            submenu: [
                {
                    label: 'Excel',
                    submenu: [
                        {
                            label: '当前文件夹文件',
                            id: MenuId.exportCurrentFolderFiles2Xlsx,
                            click() {
                                exportToXlsx(config.getCurrentItems())
                            }
                        },
                        {
                            label: '当前文件夹所有文件',
                            id: MenuId.exportCurrentAllFiles2Xlsx,
                            click() {
                                const currentPath = config.getCurrentPath();
                                const filter = allFiles.value.filter(value => value.filePath.startsWith(currentPath));
                                exportToXlsx(filter)
                            }
                        },
                        {
                            label: '所有文件',
                            id: MenuId.exportCurrentAllFiles2Xlsx,
                            click() {
                                exportToXlsx(allFiles.value)
                            }
                        }
                    ]
                },
                {
                    label: "Json",
                    submenu: [
                        {
                            label: '当前文件夹文件',
                            click() {
                                exportToJson(config.getCurrentItems())
                            }
                        },
                        {
                            label: '当前文件夹所有文件',
                            click() {
                                const currentPath = config.getCurrentPath();
                                const filter = allFiles.value.filter(value => value.filePath.startsWith(currentPath));
                                exportToJson(filter)
                            }
                        },
                        {
                            label: '所有文件',
                            click() {
                                exportToJson(allFiles.value)
                            }
                        },
                    ]
                }
            ]
        }
    ]);

    const popup = () => {
        menu.popup({
            window: BrowserWindow.getFocusedWindow()
        })
    }

    return {
        popup
    }
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
        return MenuClass.buildFromTemplate([
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
            window: BrowserWindow.getFocusedWindow()
        })
    };

    return {
        buildMouseMenu, popup
    }
}




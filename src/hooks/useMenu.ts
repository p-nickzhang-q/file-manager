import {FileEntity} from "zhangyida-tools";
import {Menu} from '@electron/remote';
import {allFiles} from "../api/file";
import {exportToJson, exportToXlsx, readExcel, useFile} from "./useFile";
import {BaseError} from "../util/error";

const {BrowserWindow, Menu: MenuClass, dialog} = require("@electron/remote");
const {FileEntity: FileEntityClass} = require('zhangyida-tools');
// todo 手动删除不在线盘符
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

export function useContextMenu(config: { tab: string, emits: any }) {
    const {items, currentPath, diskMatch} = useFile(config.tab, config.emits);

    function importConfigFile(strings: string[], getJsons: (fileEntity: FileEntity) => any[]) {
        const fileEntity = FileEntityClass.ofNullable(strings[0]).orElseThrow(() => new BaseError('文件不存在'));

        const jsons = getJsons(fileEntity);
        // 2 获取所有盘符
        const diskPaths = jsons.filter((value: any) => value.type === 'disk').map((value: any) => {
            return {
                filePath: value.filePath,
                newFilePath: null
            }
        });
        // 3 将盘符信息塞入盘符匹配中
        diskMatch.value.open(diskPaths, jsons)
    }

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
                                exportToXlsx(items.value)
                            }
                        },
                        {
                            label: '当前文件夹所有文件',
                            id: MenuId.exportCurrentAllFiles2Xlsx,
                            click() {
                                const filter = allFiles.value.filter(value => value.filePath.startsWith(currentPath.value));
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
                                exportToJson(items.value)
                            }
                        },
                        {
                            label: '当前文件夹所有文件',
                            click() {
                                const filter = allFiles.value.filter(value => value.filePath.startsWith(currentPath.value));
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
        },
        {
            label: "导入",
            submenu: [
                {
                    label: "Excel",
                    click() {
                        // 1 读取Excel信息
                        const strings = dialog.showOpenDialogSync({
                            filters: [
                                {
                                    name: 'Excel', extensions: ['xlsx']
                                }
                            ]
                        });
                        if (strings) {
                            importConfigFile(strings, (fileEntity: FileEntity) => readExcel(fileEntity.readAsBuffer()));
                        }
                    }
                },
                {
                    label: "Json",
                    click() {
                        const strings = dialog.showOpenDialogSync({
                            filters: [
                                {
                                    name: 'Json', extensions: ['json']
                                }
                            ]
                        });
                        if (strings) {
                            importConfigFile(strings, fileEntity => JSON.parse(fileEntity.readAsBuffer().toString()))
                        }
                    }
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




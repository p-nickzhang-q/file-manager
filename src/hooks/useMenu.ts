import {FileEntity} from "zhangyida-tools";
import {Menu} from '@electron/remote';
import {allFiles, FileTagEntity, removeStartWithFile, writeToDataFile} from "../api/file";
import {exportToJson, exportToXlsx, readExcel, useDelete, useFile} from "./useFile";
import {BaseError} from "../util/error";
import {useMove} from "../modules/file/useMove";
import {useCopy} from "../modules/file/useCopy";
import {useBulkAddTag} from "../modules/file/useBulkAddTag";
import {ElMessageBox} from "element-plus";
import MenuItem = Electron.MenuItem;

const {BrowserWindow, Menu: MenuClass, dialog} = require("@electron/remote");
const {FileEntity: FileEntityClass} = require('zhangyida-tools');

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
    removeOfflineDisk: 'removeOfflineDisk'
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
        MenuId.bulkAddTag,
    ],
    offlineDisk: [
        MenuId.removeOfflineDisk
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

export default function (config: { tab: string, emits: any }) {
    const target = ref<FileTagEntity>(new FileTagEntity());

    const {currentPath, getData, selectedFiles} = useFile(config.tab, config.emits);
    const {openMove} = useMove({getData, currentPath});
    const {openCopy} = useCopy({getData, currentPath});
    const {handleDelete} = useDelete(() => getData(currentPath.value));
    const {openBulkAddTag, fileTagBulkAdd} = useBulkAddTag();
    const fileRename = ref();

    const getProcessFiles = () => {
        if (selectedFiles.value?.length > 1) {
            return selectedFiles.value
        } else {
            return [target.value]
        }
    }

    const menu = MenuClass.buildFromTemplate([
        {
            label: '重命名', id: MenuId.rename, click() {
                fileRename.value.open(target.value)
            }
        },
        {
            label: '移动到', id: MenuId.move, async click() {
                await openMove(getProcessFiles())
            }
        },
        {
            label: '复制到', id: MenuId.copy, async click() {
                await openCopy(getProcessFiles())
            }
        },
        {
            label: '删除', id: MenuId.remove, async click() {
                await handleDelete(getProcessFiles())
            }
        },
        {
            label: '新标签打开', id: MenuId.newTab, click() {
                for (let item of getProcessFiles()) {
                    config.emits('openNewTap', item.filePath)
                }
            }
        },
        {
            label: "在文件浏览器中打开", id: MenuId.openInFileExplore, click() {
                target.value.open()
            }
        },
        {
            label: '批量修改', id: MenuId.bulkAddTag, click() {
                openBulkAddTag(getProcessFiles())
            }
        },
        {
            label: '移除不在线盘符', id: MenuId.removeOfflineDisk, async click() {
                await ElMessageBox.confirm("确认移除吗?")
                removeStartWithFile(target.value)
                writeToDataFile()
                await getData()
            }
        }
    ]);

    const popup = (file: FileTagEntity) => {
        target.value = file
        menu.items.forEach((menuItem: MenuItem) => {
            if (selectedFiles.value.length > 1) {
                menuItem.visible = MenuConfig.multi.includes(menuItem.id)
            } else {
                if (file.isDisk() && !file.isOnline) {
                    menuItem.visible = MenuConfig.offlineDisk.includes(menuItem.id)
                } else {
                    menuItem.visible = MenuConfig[file.type].includes(menuItem.id)
                }
            }
        })

        menu.popup({
            window: BrowserWindow.getFocusedWindow()
        })
    };

    return {
        popup, fileRename, fileTagBulkAdd
    }
}




import {confirm, isImage} from "../util/common";
import {ExcelColumnDefinition, FileEntity} from "zhangyida-tools";
import {allFiles, fetchWithDisk, FileTagEntity, sortFile, writeToDataFile} from "../api/file";
import {ElMessageBox, ElNotification} from "element-plus";

const {dialog} = require("@electron/remote");
const {
    FileEntity: File,
    ListProcess,
    ExcelProcess: ExcelProcessClass,
    ExcelColumnDefinition: ExcelColumnDefinitionClass
} = require('zhangyida-tools');
const fs = require('fs');

export const DataMap = new Map<string, TabData>();

export const isShift = ref(false);
export const isCtrl = ref(false);

const Shift = 'Shift'
const Control = 'Control'
export const currentTab = ref('0')

const Excel_Definition_Map = new Map<string, ExcelColumnDefinition>([
    ["fileName", new ExcelColumnDefinitionClass("文件名")],
    ["filePath", new ExcelColumnDefinitionClass("文件路径")],
    ["type", new ExcelColumnDefinitionClass("文件类型")],
    ["size", new ExcelColumnDefinitionClass("文件大小")],
    ["lastUpdateTime", new ExcelColumnDefinitionClass("更新时间")],
    ["createTime", new ExcelColumnDefinitionClass("创建时间")],
    ["tag", new ExcelColumnDefinitionClass("标签", (value: string) => value.split(',').filter(Boolean), (value: string[]) => value.join(','))],
    ["desc", new ExcelColumnDefinitionClass("文件描述")],
]);

window.onkeyup = ev => {
    //Shift Control
    if (ev.key === Shift) {
        isShift.value = false
    } else if (ev.key === Control) {
        isCtrl.value = false
    } else if (ev.key === 'a' && ev.ctrlKey) {
        const tabData = DataMap.get(currentTab.value);
        for (let file of tabData!.items.value) {
            file.selected = true
        }
    } else if (ev.key === 's' && ev.ctrlKey) {
        // console.log(allFiles.value.find(i => i.fileName === '160122.txt'))
        writeToDataFile()
        ElNotification.success({
            message: "保存成功"
        })
    } else {
        isShift.value = false
        isCtrl.value = false
    }
}

window.onkeydown = ev => {
    if (ev.key === Shift) {
        isShift.value = true
    } else if (ev.key === Control) {
        isCtrl.value = true
    }
}

export class TabData {
    items = ref<FileTagEntity[]>([]);
    currentPath = ref("");
    fileLoading = ref(false);
    searchMode = ref(false);
    currentFile = ref(new FileEntity());
    searchValue = ref<string>('');
    LastShiftIndex = ref<number>(0);
    sorts = ref(['default']);
    history = ref<string[]>([""]);
    historyIndex = ref<number>(0);
    layout = ref<number>(6)
    diskMatch = ref();
}

export function useFile(tabName: string, emits?: any) {

    if (!DataMap.has(tabName)) {
        DataMap.set(tabName, new TabData())
    }

    const tabData = DataMap.get(tabName)!;
    const {
        items,
        currentPath,
        fileLoading,
        currentFile,
        searchValue,
        searchMode,
        LastShiftIndex,
        sorts,
        history,
        historyIndex,
        layout
    } = tabData;

    const onViewDetail = (item: any, i: number) => {
        function clearSelected() {
            items.value.forEach(i => i.selected = false)
        }

        if (isShift.value) {
            clearSelected();
            items.value.filter((v, index) => {
                if (LastShiftIndex.value < i) {
                    return index >= LastShiftIndex.value && index <= i
                } else {
                    return index >= i && index <= LastShiftIndex.value
                }
            }).forEach(v => {
                v.selected = true
            })
        } else if (isCtrl.value) {
            item.selected = !item.selected
        } else {
            clearSelected();
            item.selected = !item.selected
            LastShiftIndex.value = i;
        }
        currentFile.value = item
    }

    const getData = async (path = '') => {
        items.value = await fetchWithDisk(path)
        currentPath.value = path
    }

    function emitGoto(filePath: string) {
        if (emits) {
            emits('goto', filePath)
        }
    }

    async function goto(filePath: string) {
        fileLoading.value = true
        emitGoto(filePath);
        await getData(filePath)
        fileLoading.value = false
    }

    const onGoTo = async (filePath = '', fromBread = false, isDiskOnline = true) => {
        if (!isDiskOnline) {
            return;
        }
        fileLoading.value = true
        if (fromBread) {
            const index = breads.value.indexOf(filePath) + 1;
            filePath = breads.value.slice(0, index).join('/');
        }
        const file = File.of(filePath)
        if (file.isFile()) {
            await file.open()
        } else {
            /**
             * 如果新路径是以老路径开始,那么就是同一路径下属,则推入历史,
             * 不然,则替换最后一个历史路径
             */
            const parentIndex = history.value.findIndex((i: string) => i.startsWith(File.getParentFolderPathByPath(filePath)));
            if (filePath.startsWith(history.value.at(-1)!)) {
                history.value.push(filePath)
            } else {
                history.value = history.value.filter((item: string, index: number) => index <= parentIndex)
                history.value = ListProcess.of([...history.value, filePath]).unique().toList()
            }
            historyIndex.value = parentIndex + 1
            await goto(filePath);
        }
        currentFile.value = new FileEntity()
        fileLoading.value = false
    }

    const breads = computed(() => {
        if (currentPath.value === undefined) {
            currentPath.value = ""
        }
        return currentPath.value.split('/').filter(Boolean)
    });

    const onSearch = async () => {
        fileLoading.value = true
        if (searchValue.value) {
            items.value = allFiles.value.filter(i => {
                return i.filePath.startsWith(currentPath.value)
            }).filter(i => {
                try {
                    return i.fileName.includes(searchValue.value) || i.tag.some(tag => tag.includes(searchValue.value))
                } catch (e) {
                    if (e) {
                        console.error(e);
                    }
                }
                return false;
            })
            searchMode.value = true
        } else {
            await getData(currentPath.value)
            searchMode.value = false
        }
        fileLoading.value = false
    }

    const goBack = async () => {
        historyIndex.value--
        const filePath = history.value[historyIndex.value];
        await goto(filePath);
    }

    const goForward = async () => {
        historyIndex.value++
        const filePath = history.value[historyIndex.value];
        if (filePath) {
            await goto(filePath);
        }
    }

    const selectedFiles = computed(() => {
        return items.value.filter(i => i.selected)
    });

    const sortFunc = {
        ['default']() {
            items.value = sortFile(items.value)
        },
        updateTime: {
            desc() {
                items.value = items.value.sort((a, b) => a.lastUpdateTime - b.lastUpdateTime).reverse()
            },
            asc() {
                items.value = items.value.sort((a, b) => a.lastUpdateTime - b.lastUpdateTime)
            }
        },
        createTime: {
            desc() {
                items.value = items.value.sort((a, b) => a.createTime - b.createTime).reverse()
            },
            asc() {
                items.value = items.value.sort((a, b) => a.createTime - b.createTime)
            }
        },
        fileSize: {
            desc() {
                items.value = items.value.sort((a, b) => a.size - b.size).reverse()
            },
            asc() {
                items.value = items.value.sort((a, b) => a.size - b.size)
            }
        },
    }

    watch([sorts, items], () => {
        const [property, sort] = sorts.value;
        if (!sort) {
            // @ts-ignore
            sortFunc[property]()
        } else {
            // @ts-ignore
            sortFunc[property][sort]()
        }
    })

    const currentImagePaths = computed(() => {
        return items.value.filter(i => isImage(i.fileName)).map(i => i.filePath)
    });

    return {
        items,
        currentPath,
        breads,
        fileLoading,
        currentFile,
        searchValue,
        searchMode,
        selectedFiles,
        sorts,
        layout,
        diskMatch: tabData.diskMatch,
        getData,
        onGoTo,
        onViewDetail,
        onSearch,
        emitGoto,
        goBack,
        goForward,
        currentImagePaths
    };
}

export const exportToXlsx = async (data: any[]) => {
    const excelProcessClass = new ExcelProcessClass(data, Excel_Definition_Map);
    const buffer = excelProcessClass.exportToBuffer("文件列表");
    const string = dialog.showSaveDialogSync({
        title: "导出路径",
        filters: [{
            name: 'xlsx', extensions: ['xlsx']
        }]
    });
    if (string) {
        fs.writeFileSync(string, buffer)
        await confirmOpen(string)
    }
}

async function confirmOpen(string: string) {
    try {
        await ElMessageBox.confirm("导出成功,是否打开")
        await File.of(string).open()
    } catch (e) {

    }
    ElNotification.success({
        message: '导出成功',
    })
}

export const exportToJson = async (data: any[]) => {
    const string = dialog.showSaveDialogSync({
        title: "导出路径",
        filters: [{
            name: 'json', extensions: ['json']
        }]
    });
    if (string) {
        fs.writeFileSync(string, JSON.stringify(data))
        await confirmOpen(string);
    }
}

export const readExcel = (buffer: Buffer) => {
    const excelProcessClass = new ExcelProcessClass([], Excel_Definition_Map);
    return excelProcessClass.readFromBuffer(buffer);
}

export function useDelete(getData: any) {
    const handleDelete = async (t: FileEntity[]) => {
        await confirm("确认删除吗")
        for (let fileEntity of t) {
            await fileEntity.remove()
        }
        getData.call();
    };
    return {
        handleDelete
    }
}

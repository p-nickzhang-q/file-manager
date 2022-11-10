import {confirm} from "../util/common";
import {FileEntity} from "zhangyida-tools";
import {allFiles, fetchWithDisk, FileTagEntity, sortFile, writeToDataFile} from "../api/file";
import {ElNotification} from "element-plus";

const {FileEntity: File, ListProcess} = require('zhangyida-tools');

export const DataMap = new Map<string, TabData>();

export const isShift = ref(false);
export const isCtrl = ref(false);

const Shift = 'Shift'
const Control = 'Control'
export const currentTab = ref('0')

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
        return false;
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

    const onGoTo = async (filePath = '', fromBread = false) => {
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
        getData,
        onGoTo,
        onViewDetail,
        onSearch,
        emitGoto,
        goBack,
        goForward,
        layout
    };
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

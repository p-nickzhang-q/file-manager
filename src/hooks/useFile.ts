import {confirm} from "../util/common";
import {FileEntity} from "zhangyida-tools";
import {allFiles, fetchWithDisk} from "../api/file";

const {FileEntity: File} = require('zhangyida-tools');

export const DataMap = new Map();

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
        const {items} = DataMap.get(currentTab.value);
        for (let file of items.value) {
            file.selected = true
        }
        return false;
    }
}

window.onkeydown = ev => {
    if (ev.key === Shift) {
        isShift.value = true
    } else if (ev.key === Control) {
        isCtrl.value = true
    }
}

export function useFile(tabName: string, emits?: any) {

    if (!DataMap.has(tabName)) {
        const items = ref<FileEntity[]>([]);
        const currentPath = ref('');
        const fileLoading = ref(false);
        const searchMode = ref(false);
        const currentFile = ref(new FileEntity());
        const searchValue = ref<string>();
        const LastShiftIndex = ref<number>();

        DataMap.set(tabName, {
            items, currentPath, fileLoading, currentFile, searchValue, searchMode, LastShiftIndex
        })
    }

    const {
        items,
        currentPath,
        fileLoading,
        currentFile,
        searchValue,
        searchMode,
        LastShiftIndex
    } = DataMap.get(tabName);

    const onViewDetail = (item: any, i: number) => {
        function clearSelected() {
            // @ts-ignore
            items.value.forEach(i => i.selected = false)
        }

        if (isShift.value) {
            clearSelected();
            // @ts-ignore
            items.value.filter((v, index) => {
                if (LastShiftIndex.value < i) {
                    return index >= LastShiftIndex.value && index <= i
                } else {
                    return index >= i && index <= LastShiftIndex.value
                }
                // @ts-ignore
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

    const getData = async (path?: string) => {
        items.value = await fetchWithDisk(path)
        currentPath.value = path
    }

    function emitGoto(filePath: string) {
        if (emits) {
            emits('goto', filePath)
        }
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
            emitGoto(filePath);
            await getData(filePath)
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
                // @ts-ignore
                return i.fileName.includes(searchValue.value) || i.tag.some(tag => tag.includes(searchValue.value))
            }).map(i => File.ofJson(i))
            searchMode.value = true
        } else {
            await getData(currentPath.value)
            searchMode.value = false
        }
        fileLoading.value = false
    }

    const selectedFiles = computed(args => {
        // @ts-ignore
        return items.value.filter(i => i.selected)
    });

    return {
        items,
        getData,
        onGoTo,
        currentPath,
        breads,
        fileLoading,
        currentFile,
        onViewDetail,
        searchValue,
        onSearch,
        emitGoto,
        searchMode,
        selectedFiles,
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

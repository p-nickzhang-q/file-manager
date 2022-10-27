import {confirm} from "../util/common";
import {FileEntity} from "zhangyida-tools";
import {allFiles, fetchWithDisk} from "../api/file";

const {FileEntity: File} = require('zhangyida-tools');

export const DataMap = new Map();

export function useFile(tabName: string, emits?: any) {

    if (!DataMap.has(tabName)) {
        const items = ref<FileEntity[]>([]);
        const currentPath = ref('');
        const fileLoading = ref(false);
        const searchMode = ref(false);
        const currentFile = ref(new FileEntity());
        const searchValue = ref<string>();

        DataMap.set(tabName, {
            items, currentPath, fileLoading, currentFile, searchValue, searchMode
        })
    }

    const {items, currentPath, fileLoading, currentFile, searchValue, searchMode} = DataMap.get(tabName);

    const onViewDetail = (item: any) => {
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
        searchMode
    };
}

export function useDelete(getData: any) {
    const handleDelete = async (t: FileEntity) => {
        await confirm("确认删除吗")
        await t.remove()
        getData.call();
    };
    return {
        handleDelete
    }
}

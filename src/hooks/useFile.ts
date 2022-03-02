import {computed, defineEmits, ref} from "vue";
import {FileApiInstance, FileEntity} from "../api/fileApi";
import {confirm, GetData} from "../util/common";

const map = new Map();

export function useFile(tabName: string, emits?: any) {

    if (!map.has(tabName)) {
        const items = ref<FileEntity[]>([]);
        const currentPath = ref('');
        const fileLoading = ref(false);
        const currentFile = ref(new FileEntity());
        const searchValue = ref<string>();

        map.set(tabName, {
            items, currentPath, fileLoading, currentFile, searchValue
        })
    }

    const {items, currentPath, fileLoading, currentFile, searchValue} = map.get(tabName);

    const onViewDetail = (item: any) => {
        currentFile.value = item
    }

    const getData = async (path?: string) => {
        items.value = await FileApiInstance.fetch(path);
        currentPath.value = path
    }

    function emitGoto(filePath: string) {
        if (emits) {
            emits('goto', filePath)
        }
    }

    const onGoTo = async (filePath = "", fromBread = false, isDocument = false) => {
        fileLoading.value = true
        if (fromBread) {
            const index = breads.value.indexOf(filePath) + 1;
            filePath = breads.value.slice(0, index).join('/');
        }
        if (!isDocument) {
            emitGoto(filePath);
            await getData(filePath)
        } else {
            await FileApiInstance.open(filePath)
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
        items.value = await FileApiInstance.search(searchValue.value, currentPath.value);
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
        emitGoto
    };
}

export function useDelete(getData: any) {
    const handleDelete = async (t: FileEntity) => {
        await confirm("确认删除吗")
        await FileApiInstance.delete(t)
        getData.call();
    };
    return {
        handleDelete
    }
}

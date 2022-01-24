import {computed, defineEmits, ref} from "vue";
import {FileApiInstance, FileEntity} from "../api/fileApi";
import {confirm, GetData} from "../util/common";

const map = new Map();

export function useFile(tabName: string) {

    if (!map.has(tabName)) {
        const items = ref<FileEntity[]>([]);
        const currentPath = ref('');
        const fileLoading = ref(false);
        const currentFile = ref(new FileEntity());

        map.set(tabName, {
            items, currentPath, fileLoading, currentFile
        })
    }

    const {items, currentPath, fileLoading, currentFile} = map.get(tabName);

    const onViewDetail = (item: any) => {
        currentFile.value = item
    }

    const getData = async (path?: string) => {
        items.value = await FileApiInstance.fetch(path);
        currentPath.value = path
    }

    const onGoTo = async (filePath = "", fromBread = false, isDocument = false) => {
        fileLoading.value = true
        if (fromBread) {
            const index = breads.value.indexOf(filePath) + 1;
            filePath = breads.value.slice(0, index).join('/');
        }
        if (!isDocument) {
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
    const emits = defineEmits(["openNewTap"]);

    const handleOpenOnNewTab = (t: FileEntity) => {
        emits("openNewTap", t.filePath)
    };
    return {
        items,
        getData,
        onGoTo,
        currentPath,
        breads,
        fileLoading,
        currentFile,
        onViewDetail,
        handleOpenOnNewTab,
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

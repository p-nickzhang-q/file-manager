import {computed, ref} from "vue";
import {FileApiInstance, FileEntity} from "../api/fileApi";

const map = new Map();

export default function (tabName: string) {

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
    }

    const onGoTo = async (filePath = "", fromBread = false, isDocument = false) => {
        fileLoading.value = true
        if (fromBread) {
            const index = breads.value.indexOf(filePath) + 1;
            filePath = breads.value.slice(0, index).join('/');
        }
        if (!isDocument) {
            await getData(filePath)
            currentPath.value = filePath
        } else {
            await FileApiInstance.open(filePath)
        }
        currentFile.value = new FileEntity()
        fileLoading.value = false
    }

    const breads = computed(() => {
        return currentPath.value.split('/').filter(Boolean)
    });
    return {items, getData, onGoTo, currentPath, breads, fileLoading, currentFile, onViewDetail};
}

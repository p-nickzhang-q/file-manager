import {FileTagEntity} from "../../api/file";

export const useBulkAddTag = () => {
    const fileTagBulkAdd = ref();

    const openBulkAddTag = (items: FileTagEntity[]) => {
        fileTagBulkAdd.value.open(items)
    };

    return {
        fileTagBulkAdd, openBulkAddTag
    }
}

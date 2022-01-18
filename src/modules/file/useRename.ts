import {ref} from "vue";
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import useMouseOptions from "../../hooks/useMouseOptions";
import {confirm, MouseOptionFunc} from "../../util/common";
import {Ref} from "@vue/reactivity";

export const useRename: MouseOptionFunc = (getData, currentPath) => {
    const renameDialog: any = ref(null);
    const newNameFile = ref<FileEntity>(new FileEntity());
    const newName = ref<string>();


    const handleRename = async () => {
        await FileApiInstance.rename(newNameFile.value, newName.value!)
        await getData(currentPath.value)
        renameDialog.value.close()
    }
    return {renameDialog, newName, newNameFile, handleRename};
}

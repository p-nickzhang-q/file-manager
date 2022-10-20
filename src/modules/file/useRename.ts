import {ref} from "vue";
import {MouseOptionParam} from "../../util/common";
import {FileEntity} from "zhangyida-tools";

export const useRename = ({getData, currentPath}: MouseOptionParam) => {
    const renameDialog: any = ref(null);
    const newNameFile = ref<FileEntity>(new FileEntity());
    const newName = ref<string>();


    const handleRename = async () => {
        if (newName.value) {
            newNameFile.value.rename(newName.value)
            // await getData(currentPath.value)
            renameDialog.value.close()
        }
    }
    const openRename = (t: FileEntity) => {
        renameDialog.value.open()
        newNameFile.value = t;
        newName.value = t.fileName
    };
    return {renameDialog, newName, newNameFile, handleRename, openRename};
}

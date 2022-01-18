import {MouseOptionFunc} from "../../util/common";
import {ref} from "vue";
import {FileApiInstance, FileEntity} from "../../api/fileApi";

export const useCopy: MouseOptionFunc = (getData, currentPath) => {
    const copyDialog = ref<any>();
    const copyFile = ref<FileEntity>();
    const newFolderPath = ref<string>();
    const handleCopy = async () => {
        await FileApiInstance.copy(copyFile.value!, newFolderPath.value!)
        await getData(currentPath.value)
        copyDialog.value.close()
    }

    const onCopyTreeNodeClick = (file: FileEntity) => {
        newFolderPath.value = file.filePath
    }
    return {copyDialog, copyFile, handleCopy, onCopyTreeNodeClick};
}

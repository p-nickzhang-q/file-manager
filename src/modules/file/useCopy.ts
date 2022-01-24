import {ref} from "vue";
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import {MouseOptionParam} from "../../util/common";

export const useCopy = ({getData, currentPath}: MouseOptionParam) => {
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
    const openCopy = (t: FileEntity) => {
        copyDialog.value.open()
        copyFile.value = t
    };
    return {copyDialog, copyFile, handleCopy, onCopyTreeNodeClick, openCopy};
}

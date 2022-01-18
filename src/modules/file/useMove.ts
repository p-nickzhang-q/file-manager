import {ref} from "vue";
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import {MouseOptionFunc} from "../../util/common";

export const useMove: MouseOptionFunc = (getData, currentPath) => {
    const moveDialog = ref<any>();
    const moveFile = ref<FileEntity>();
    const newFolderPath = ref<string>();
    const onMoveTreeNodeClick = (file: FileEntity) => {
        newFolderPath.value = file.filePath
    }
    const handleMove = async () => {
        await FileApiInstance.move(moveFile.value!, newFolderPath.value!)
        await getData(currentPath.value)
        moveDialog.value.close()
    }
    return {moveDialog, moveFile, onMoveTreeNodeClick, handleMove};
};

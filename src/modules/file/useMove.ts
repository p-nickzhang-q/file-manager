import {ref} from "vue";
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import {MouseOptionParam} from "../../util/common";

export const useMove = ({getData, currentPath}: MouseOptionParam) => {
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
    const openMove = (t: FileEntity) => {
        moveDialog.value.open()
        moveFile.value = t
    };
    return {moveDialog, moveFile, onMoveTreeNodeClick, handleMove, openMove};
};

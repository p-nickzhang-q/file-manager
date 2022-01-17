import {ref} from "vue";
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import useMouseOptions from "../../hooks/useMouseOptions";
import {confirm} from "../../util/common";

export default function (getData: any, currentPath: any) {
    const renameDialog: any = ref(null);
    const newNameFile = ref<FileEntity>(new FileEntity());
    const newName = ref<string>();
    const {getMouseOptions} = useMouseOptions<FileEntity>([
        {
            label: "重命名",
            fn: t => {
                renameDialog.value.open()
                newNameFile.value = t;
                newName.value = t.fileName
            }
        },
        {
            label: "移动",
            fn: t => {
                console.log(t)
            }
        },
        {
            label: "复制",
            fn: t => {
                console.log(t)
            }
        },
    ]);

    const handleRename = async () => {
        try {
            await confirm()
            await FileApiInstance.rename(newNameFile.value, newName.value!)
            await getData(currentPath.value)
            renameDialog.value.close()
        } catch (e) {
            if (e) {
                console.error(e);
            }
        }
    }
    return {renameDialog, newName, getMouseOptions, handleRename};
}

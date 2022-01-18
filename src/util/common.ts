import {ElMessage, ElMessageBox} from 'element-plus'
import "element-plus/dist/index.css"
import {Ref} from "@vue/reactivity";

export async function confirm(message = "确认吗?") {
    await ElMessageBox.confirm(
        message,
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
}

export function errorMessage(message: string) {
    ElMessage.error(message)
}

export type MouseOptionFunc = (getData: (path?: string) => Promise<any>, currentPath: Ref<string>) => any

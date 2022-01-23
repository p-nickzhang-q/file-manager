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

export function message(message = "成功") {
    ElMessage.success(message)
}

export function deepCopy<T>(data: T): T {
    // return new Promise(resolve => {
    //     const {port1, port2} = new MessageChannel();
    //     port2.onmessage = ev => resolve(ev.data);
    //     port1.postMessage(data);
    // })
    return JSON.parse(JSON.stringify(data))
}

export function getFileNameByPath(filePath: string) {
    const split = filePath.split("/");
    return split[split.length - 1]
}

export type MouseOptionFunc = (getData: (path?: string) => Promise<any>, currentPath: Ref<string>) => any

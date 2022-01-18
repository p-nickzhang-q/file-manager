import {FileEntity} from "../api/fileApi";
import {Ref} from "@vue/reactivity";

export type MenuItem<T> = {
    label: string
    tips?: string
    fn: (t: T) => void
}

export default function <T extends FileEntity>(menuList: MenuItem<T>[]) {
    const getMouseOptions = (item: T) => {
        return {
            params: item,
            useLongPressInMobile: true,
            menuList,
            disabled: (item: T) => {
                return item.isDisk
            }
        }
    }

    return {getMouseOptions}
}

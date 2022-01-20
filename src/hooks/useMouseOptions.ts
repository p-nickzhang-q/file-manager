import {FileEntity} from "../api/fileApi";
import {Ref} from "@vue/reactivity";
import {deepCopy} from "../util/common";

export type MenuItem<T> = {
    label: string
    tips?: string
    fn: (t: T) => void
}

export default function <T extends FileEntity>(menuListSetting: MenuItem<T>[]) {
    const getMouseOptions = (item: T) => {
        let menuList = [...menuListSetting];
        if (item.isFile) {
            menuList = menuList.filter(value => value.label !== '新标签打开');
        }
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

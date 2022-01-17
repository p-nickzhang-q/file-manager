export type MenuItem<T> = {
    label: string
    tips?: string
    fn: (t: T) => void
}

export default function <T>(menuList: MenuItem<T>[]) {
    const getMouseOptions = (item: T) => {
        return {
            params: item,
            useLongPressInMobile: true,
            menuList
        }
    }

    return {getMouseOptions}
}

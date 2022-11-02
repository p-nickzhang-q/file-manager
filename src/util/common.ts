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
    return JSON.parse(JSON.stringify(data))
}

export function getTabNameByFilePath(filePath?: string) {
    if (filePath) {
        const split = filePath.split("/").filter(Boolean);
        return split[split.length - 1]
    } else {
        return defaultTabTitle
    }
}

export function getExtByFileName(fileName: string) {
    const strings = fileName.split('.');
    return strings[strings.length - 1]
}

export const defaultTabTitle = '我的电脑';

export type GetData = ((path?: string) => Promise<void>) | (() => Promise<void>);

export type MouseOptionParam = {
    currentPath: Ref<string>
    getData: GetData,
}


export function groupBy(arr: any[], groupPropertyNames: string[]) {
    const map = new Map()
    arr.forEach(item => {
        const key = groupPropertyNames.reduce((pv, cv, index) => {
            const cvArr = cv.split('.')
            let value = item
            cvArr.forEach(k => {
                value = value[k]
            })
            if (index === 0) {
                return value
            } else {
                return `${pv}.${value}`
            }
        }, '')
        if (!map.has(key)) {
            map.set(key, [])
        }
        map.get(key).push(item)
    })
    return Object.fromEntries(map)
}

export function groupSum(arr: any[], groupPropertyNames: string[], sumPropertyNames: string[]) {
    const map = groupBy(arr, groupPropertyNames);
    const sumMap: any = {}
    Object.keys(map).forEach(key => {
        const groupArr = map[key]
        sumMap[key] = {}
        sumPropertyNames.forEach(sumPropertyName => {
            // $count, 计算分组里的个数
            if (sumPropertyName === '$count') {
                sumMap[key]['$count'] = groupArr.length
            } else {
                sumMap[key][sumPropertyName] = sum(groupArr, sumPropertyName)
            }
        })
    })

    return sumMap
}

export function sum(arr: any[], sumPropertyName: string) {
    return arr.reduce((pv, cv, index) => {
        return pv + (cv[sumPropertyName] ? cv[sumPropertyName] : 0)
    }, 0)
}

export function longTimeFormat(time: number) {
    if (!time) {
        return ''
    }
    const date = new Date(time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

export function toWindowPath(path: string) {
    let s = path.replace(/\//g, "\\");
    if (s.endsWith(":")) {
        s += '\\';
    }
    return s;
}

const MediaType = {
    image: [
        "bmp",
        "jpg",
        "png",
        "tif",
        "gif",
        "pcx",
        "tga",
        "exif",
        "fpx",
        "svg",
        "psd",
        "cdr",
        "pcd",
        "dxf",
        "ufo",
        "eps",
        "ai",
        "raw",
        "wmf",
        "jpeg",
    ],
    audio: [
        "mp3",
        "aac",
        "wav",
        "wma",
        "cda",
        "flac",
        "m4a",
        "mid",
        "mka",
        "mp2",
        "mpa",
        "mpc",
        "ape",
        "ofr",
        "ogg",
        "ra",
        "wv",
        "tta",
        "ac3",
        "dts"
    ],
    video: [
        "mp4",
        "m4v",
        "mov",
        "qt",
        "avi",
        "flv",
        "wmv",
        "asf",
        "mpeg",
        "mpg",
        "vob",
        "mkv",
        "rm",
        "rmvb",
        "ts",
        "dat",
    ]
}

export function isImage(fileName: string) {
    const ext = getExtByFileName(fileName);
    return MediaType.image.includes(ext);
}

export function getMediaType(fileName: string) {
    const ext = getExtByFileName(fileName);

    return Object.keys(MediaType).find(key => {
        // @ts-ignore
        return MediaType[key].includes(ext);
    })
}

import {Api} from "./api";
import {FileEntity} from "zhangyida-tools";

// export class FileEntity {
//     fileName: string = ""
//     filePath: string = ""
//     isDirectory: boolean = false
//     isDisk: boolean = false
//     readonly isFile: boolean = !this.isDirectory && !this.isDisk
//     tagIds: string[] = []
//     size: number = 0
//     lastUpdateTime: Date | null = null;
//     createTime: Date | null = null;
// }

class FileApi extends Api<FileEntity> {
    path: string = '/file';

    async fetch(path?: string, isDirectory?: boolean): Promise<FileEntity[]> {
        return await super.request({params: {path, isDirectory}, method: "get"})
    }

    async open(path: string) {
        await super.request({method: 'post', params: {path}})
    }

    async move(data: FileEntity, targetPath: string) {
        await super.request({
            url: '/move',
            method: 'put',
            data,
            params: {
                targetPath
            }
        })
    }

    async rename(data: FileEntity, newName: string) {
        await super.request({
            url: '/rename',
            method: 'put',
            data,
            params: {
                newName
            }
        })
    }

    async copy(data: FileEntity, targetPath: string) {
        await super.request({
            url: '/copy',
            method: 'put',
            data,
            params: {
                targetPath
            }
        })
    }

    async delete(data: FileEntity) {
        await super.request({
            url: '/delete',
            method: 'put',
            data
        })
    }

    async search(search: string, path?: string) {
        return await super.request({
            url: "/search",
            method: "get",
            params: {
                search, path
            }
        })
    }
}

export const FileApiInstance = new FileApi()

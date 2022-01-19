import {Api} from "./api";

export class FileEntity {
    fileName: string = ""
    filePath: string = ""
    isDirectory: boolean = false
    isDisk: boolean = false
    readonly isFile: boolean = !this.isDirectory && !this.isDisk
    tagIds: string[] = []
}

class FileApi extends Api<FileEntity> {
    path: string = '/file';

    async fetch(path?: string): Promise<FileEntity[]> {
        return await super.request({params: {path}, method: "get"})
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
}

export const FileApiInstance = new FileApi()

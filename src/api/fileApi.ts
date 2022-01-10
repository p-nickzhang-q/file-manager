import {Api} from "./api";

export class FileEntity {
    fileName: string = ""
    filePath: string = ""
    isDirectory: boolean = false
    isDisk: boolean = false
}

class FileApi extends Api {
    path: string = '/file';

    async fetch(path?: string): Promise<FileEntity[]> {
        return await super.request({params: {path}, method: "get"})
    }

    async open(path: string) {
        await super.request({method: 'post', params: {path}})
    }
}

export const FileApiInstance = new FileApi()

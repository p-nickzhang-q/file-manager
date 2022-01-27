import {Api} from "./api";
import {FileEntity} from "./fileApi";

export class TagEntity {
    id: string
    value: string

    constructor(id: string, value: string) {
        this.id = id;
        this.value = value;
    }
}

export class TagFileEntity {
    tagIds: string[];
    filePath: string;
    tags: TagEntity[] = []
    file: FileEntity = new FileEntity()

    constructor(tagIds: string[], filePath: string) {
        this.tagIds = tagIds;
        this.filePath = filePath;
    }
}

export class TagApi extends Api<TagEntity> {
    path: string = "/tag";

    async fetch(keyWords?: string): Promise<TagEntity[]> {
        return await super.request({
            method: "get",
            params: {
                keyWords
            }
        })
    }

    async save(data: TagEntity) {
        return await super.request({method: "post", data})
    }

    async remove(...ids: string[]) {
        return await super.request({method: "delete", params: {ids}})
    }
}

export class TagFileApi extends Api<TagFileEntity> {
    path: string = "/tag";

    async fetch(tagIds?: string[]): Promise<TagFileEntity[]> {
        return await super.request({
            method: "get",
            url: "/files",
            params: {
                tagIds
            }
        })
    }

    async save(data: TagFileEntity) {
        return await super.request({
            method: "post",
            url: "/files",
            data
        })
    }

    async getByFilePath(filePath: string) {
        return await super.request({
            url: `/files/path/${filePath}`,
            method: 'get'
        })
    }
}

export const TagApiInstance = new TagApi()
export const TagFileApiInstance = new TagFileApi()

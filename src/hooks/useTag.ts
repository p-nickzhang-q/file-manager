import {allFiles, getDbTag, TAG_DATA_ENTITY, writeToDataFile} from "../api/file";

const tagOptions = ref<string[]>([]);

export default function () {

    const getTags = () => {
        tagOptions.value = getDbTag();
    }

    const ifNewTagThenAdd = (tags: string[]) => {
        let changed = false;
        tags.forEach(value => {
            if (!tagOptions.value.includes(value)) {
                tagOptions.value.push(value)
                changed = true;
            }
        })
        if (changed) {
            writeToTagData()
        }
    }

    function writeToTagData() {
        TAG_DATA_ENTITY.writeJson(tagOptions.value)
        getTags()
    }

    function syncTagData(config: { newTag?: string; oldTag?: string, removeTag?: string }) {
        allFiles.value.forEach(file => {
            if (config.removeTag) {
                file.tag = file.tag.filter(tag => tag !== config.removeTag)
            }
            if (config.newTag && config.oldTag) {
                // @ts-ignore
                file.tag = file.tag.map(tag => {
                    if (tag === config.oldTag) {
                        return config.newTag
                    } else {
                        return tag;
                    }
                })
            }
        })
        writeToDataFile()
        writeToTagData();
    }


    return {
        getTags, tagOptions, ifNewTagThenAdd, syncTagData
    }
}

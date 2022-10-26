import {getDbTag, TAG_DATA_ENTITY} from "../api/file";

const tagOptions = ref<string[]>([]);

export default function () {

    const getTags = () => {
        tagOptions.value = getDbTag();
    }

    const ifNewTagThenAdd = (tags = []) => {
        let changed = false;
        // @ts-ignore
        tags.forEach(value => {
            if (!tagOptions.value.includes(value)) {
                tagOptions.value.push(value)
                changed = true;
            }
        })
        if (changed) {
            syncTagData()
        }
    }

    function syncTagData() {
        TAG_DATA_ENTITY.writeJson(tagOptions.value)
        getTags()
    }


    return {
        getTags, tagOptions, ifNewTagThenAdd, syncTagData
    }
}

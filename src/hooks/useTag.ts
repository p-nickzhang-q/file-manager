import {ref} from "vue";
import {TagApiInstance, TagEntity} from "../api/tagApi";

const tagOptions = ref<TagEntity[]>([]);

export default function () {

    const getTags = async (keyWords?: string) => {
        tagOptions.value = await TagApiInstance.fetch(keyWords);
    }

    return {
        getTags, tagOptions
    }
}

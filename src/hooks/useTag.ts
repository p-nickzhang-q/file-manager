import {ref} from "vue";
import {TagApiInstance, TagEntity} from "../api/tagApi";

const tagOptions = ref<TagEntity[]>([]);

export default function () {

    const getTags = async () => {
        tagOptions.value = await TagApiInstance.fetch();
    }

    return {
        getTags, tagOptions
    }
}

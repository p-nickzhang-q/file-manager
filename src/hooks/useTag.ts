import {ref} from "vue";
import {TAG_DATA_ENTITY} from "../api/file";

const tagOptions = ref<string[]>([]);

export default function () {

    const getTags = async () => {
        tagOptions.value = TAG_DATA_ENTITY.json();
    }

    return {
        getTags, tagOptions
    }
}

import {computed, ref} from "vue";

export default function (todos: { value: any[]; }) {
    const filter = ref("all");
    const filteredTodos = computed(() => {
        switch (filter.value) {
            case "done":
                return todos.value.filter(i => i.completed);
            case "todo":
                return todos.value.filter(i => !i.completed);
            default:
                return todos.value
        }
    })

    return {
        filter, filteredTodos
    }
}

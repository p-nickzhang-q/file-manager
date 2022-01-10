import {onMounted, ref} from "vue";

const todoListKey = "todoList";
export default function () {
    const todos = ref([])
    const addTodo = (todo: any) => {
        // @ts-ignore
        todos.value.push(todo);
        localStorage.setItem(todoListKey, JSON.stringify(todos.value))
        fetchTodos();
    };
    const updateTodo = (todo: any) => {
        // @ts-ignore
        let idx = todos.value.findIndex(i => i.id === todo.id);
        // @ts-ignore
        todos.value[idx] = todo
        localStorage.setItem(todoListKey, JSON.stringify(todos.value))
    }

    const fetchTodos =  () => {
        // const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_limit=5`);
        // const rawTodos = await response.json();
        todos.value = JSON.parse(<string>localStorage.getItem(todoListKey)) || [];
    }

    onMounted(async () => {
        await fetchTodos();
    })

    return {
        todos, addTodo, updateTodo
    }
}

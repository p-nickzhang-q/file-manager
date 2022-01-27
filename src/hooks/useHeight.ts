export function useHeight() {
    const height = computed(() => {
        return document.documentElement.clientHeight - 200
    });
    return {height};
}

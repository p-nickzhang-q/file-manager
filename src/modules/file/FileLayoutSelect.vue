<script lang="ts" setup>
const props = defineProps<{
  value: number
}>();

const emits = defineEmits(['update:value']);

const localValue = computed({
  get() {
    return props.value
  },
  set(value) {
    emits('update:value', value);
  }
});

</script>

<template>
  <el-select v-model="localValue">
    <el-option v-for="num in [1,2,3,4,6,8,12,24]" :key="num" :label="`一行${24/num}个`" :value="num"/>
  </el-select>
</template>

<style scoped>

</style>

<script lang="ts" setup>

import {ref, watch, watchEffect} from 'vue'
import useTag from "../../hooks/useTag";

const props = defineProps<{
  value: string[]
}>();


const emits = defineEmits(['update:value']);

const sourceValue = ref<string[]>([])

watchEffect(() => {
  sourceValue.value = props.value || [];
});

watch(
    () => sourceValue.value,
    (v: string[]) => {
      emits('update:value', v);
    },
);

const {getTags, tagOptions} = useTag();

getTags()

</script>

<template>
  <el-select
      v-model="value"
      multiple
      filterable
      allow-create
      default-first-option
  >
    <el-option
        v-for="item in tagOptions"
        :key="item"
        :label="item"
        :value="item"
    >
    </el-option>
  </el-select>
</template>

<style scoped>
.el-select {
  width: 100%;
}
</style>

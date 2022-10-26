<script lang="ts" setup>
import useTag from "../../hooks/useTag";

const props = defineProps<{
  value: string[]
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

const {getTags, tagOptions} = useTag();

getTags()

</script>

<template>
  <el-select
      v-model="localValue"
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

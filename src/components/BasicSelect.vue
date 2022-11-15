<script lang="ts" setup>
const props = defineProps<{
  value: number,
  options: any[]
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

const localOptions = computed(() => {
  const at0 = props.options.at(0);
  if (at0) {
    if (at0 instanceof Object) {
      return props.options
    } else {
      return props.options.map(value => {
        return {
          value,
          label: value
        }
      })
    }
  }
  return props.options
});
</script>

<template>
  <el-select v-model="localValue">
    <el-option
        v-for="item in localOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
  </el-select>
</template>

<style scoped>

</style>

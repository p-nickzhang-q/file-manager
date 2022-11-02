<script lang="ts" setup>

const props = defineProps<{
  modelValue: string[]
}>();

const emits = defineEmits(['update:modelValue']);

const localValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value);
  }
});

const sort = [
  {
    value: 'asc',
    label: '顺序'
  },
  {
    value: 'desc',
    label: '逆序'
  },
]

// const sortFunc = {
//   ['default']() {
//     localFiles.value = sortFile(localFiles.value)
//   },
//   updateTime: {
//     desc() {
//       localFiles.value = localFiles.value.sort((a, b) => a.lastUpdateTime - b.lastUpdateTime).reverse()
//     },
//     asc() {
//       localFiles.value = localFiles.value.sort((a, b) => a.lastUpdateTime - b.lastUpdateTime)
//     }
//   },
//   createTime: {
//     desc() {
//       localFiles.value = localFiles.value.sort((a, b) => a.createTime - b.createTime).reverse()
//     },
//     asc() {
//       localFiles.value = localFiles.value.sort((a, b) => a.createTime - b.createTime)
//     }
//   },
//
// }

const options = [
  {
    value: 'default',
    label: '默认排序'
  },
  {
    value: 'updateTime',
    label: '更新时间',
    children: sort
  },
  {
    value: 'createTime',
    label: '创建时间',
    children: sort
  }
]

</script>

<template>
  <div style="padding-bottom: 10px">
    <el-cascader
        v-model="localValue"
        placeholder="排序"
        :options="options"
    />
  </div>
</template>

<style scoped>

</style>

<script lang="ts" setup>

const props = defineProps<{
  value: string
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

const options = [
  {
    value: 'image',
    label: '图片'
  },
  {
    value: 'video',
    label: '视频'
  },
  {
    value: 'audio',
    label: '音频'
  },
]

</script>

<template>
  <el-select v-model="localValue" placeholder="媒体类型" clearable="true">
    <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"/>
  </el-select>
</template>

<style scoped>

</style>

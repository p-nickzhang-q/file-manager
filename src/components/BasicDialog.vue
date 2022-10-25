<script lang="ts" setup>
import {ref} from 'vue'

const props = withDefaults(defineProps<{
      title: string,
      width?: string | number
    }>()
    , {
      width: "30%"
    });
const dialogVisible = ref(false)

const open = () => {
  dialogVisible.value = true
}

const close = () => {
  dialogVisible.value = false
}

defineExpose({
  open, close
})

</script>

<template>
  <el-dialog
      v-model="dialogVisible"
      :title="props.title"
      :width="props.width"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      draggable
      append-to-body
  >
    <slot></slot>
    <template #footer>
      <span class="dialog-footer">
        <slot name="button"></slot>
        <el-button @click="close">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>

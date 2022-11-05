<script lang="ts" setup>
import FileTagsSelect from "./FileTagsSelect.vue";
import BasicDialog from "../../components/BasicDialog.vue";
import {FileTagEntity} from "../../api/file";

const tags = ref<string[]>([]);
const dialog = ref();
const selectFiles = ref<FileTagEntity[]>([]);

const open = (items: FileTagEntity[]) => {
  selectFiles.value = items
  dialog.value.open()
}

const handleAddTags = () => {
  console.log(selectFiles.value)
}

defineExpose({
  open
})
</script>

<template>
  <BasicDialog title="批量添加标签" ref="dialog">
    <FileTagsSelect v-model:value="tags"/>
    <template #button>
      <el-button @click="handleAddTags">确认</el-button>
    </template>
  </BasicDialog>
</template>

<style scoped>

</style>

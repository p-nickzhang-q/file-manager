<script lang="ts" setup>
import FileTagsSelect from "./FileTagsSelect.vue";
import BasicDialog from "../../components/BasicDialog.vue";
import {FileTagEntity, updateFileTagEntities} from "../../api/file";
import useTag from "../../hooks/useTag";

const {ListProcess} = require('zhangyida-tools');

const tags = ref<string[]>([]);
const dialog = ref();
const selectFiles = ref<FileTagEntity[]>([]);

const open = (items: FileTagEntity[]) => {
  tags.value = []
  selectFiles.value = items
  dialog.value.open()
}

const emits = defineEmits(['success']);

const {ifNewTagThenAdd} = useTag();

const handleAddTags = () => {
  updateFileTagEntities(selectFiles.value, file => {
    file.tag = ListProcess.of([...file.tag, ...tags.value]).unique().toList()
  })
  ifNewTagThenAdd(tags.value)
  emits('success')
  dialog.value.close()
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

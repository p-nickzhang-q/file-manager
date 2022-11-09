<script lang="ts" setup>
import FileTagsSelect from "./FileTagsSelect.vue";
import BasicDialog from "../../components/BasicDialog.vue";
import {FileTagEntity, updateFileTagEntities} from "../../api/file";
import useTag from "../../hooks/useTag";
import {shallowCopy} from "../../util/common";

const {ListProcess} = require('zhangyida-tools');

const bulkFileTagEntity = ref<FileTagEntity>(new FileTagEntity());
const dialog = ref();
const selectFiles = ref<FileTagEntity[]>([]);

const open = (items: FileTagEntity[]) => {
  bulkFileTagEntity.value = new FileTagEntity();
  selectFiles.value = items
  dialog.value.open()
}

const emits = defineEmits(['success']);

const {ifNewTagThenAdd} = useTag();

const handleAddTags = () => {
  updateFileTagEntities(selectFiles.value, file => {
    file.tag = ListProcess.of([...file.tag, ...bulkFileTagEntity.value.tag]).unique().toList()
    shallowCopy(bulkFileTagEntity.value, file, ['desc'])
  })
  ifNewTagThenAdd(bulkFileTagEntity.value.tag)
  emits('success')
  dialog.value.close()
}

defineExpose({
  open
})
</script>

<template>
  <BasicDialog title="批量修改" ref="dialog">
    <el-form label-position="top" size="large">
      <el-form-item label="标签">
        <FileTagsSelect v-model:value="bulkFileTagEntity.tag"/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="bulkFileTagEntity.desc" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #button>
      <el-button @click="handleAddTags">确认</el-button>
    </template>
  </BasicDialog>
</template>

<style scoped>

</style>

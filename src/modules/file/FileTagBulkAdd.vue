<script lang="ts" setup>
import FileTagsSelect from "./FileTagsSelect.vue";
import BasicDialog from "../../components/BasicDialog.vue";
import {CUSTOM_FORM_JSON, FileTagEntity, syncInfo, updateFileTagEntities} from "../../api/file";
import useTag from "../../hooks/useTag";
import CustomFormItems from "../../components/custom/CustomFormItems.vue";

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
    syncInfo(bulkFileTagEntity.value, file)
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
      <CustomFormItems :config="CUSTOM_FORM_JSON" v-model:form="bulkFileTagEntity"/>
    </el-form>
    <template #button>
      <el-button @click="handleAddTags">确认</el-button>
    </template>
  </BasicDialog>
</template>

<style scoped>

</style>

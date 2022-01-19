<script lang="ts" setup>
import {FileEntity} from "../../api/fileApi";
import FileTagsSelect from "./FileTagsSelect.vue";
import {TagApiInstance, TagFileApiInstance, TagFileEntity} from "../../api/tagApi";
import {ref, watchEffect} from "vue";
import useTag from "../../hooks/useTag";
import {errorMessage, message} from "../../util/common";

const props = defineProps<{
  value: FileEntity
}>();

const sourceValue = ref<FileEntity>(new FileEntity())

watchEffect(() => {
  sourceValue.value = props.value;
});

const emits = defineEmits(["success"]);
const {getTags} = useTag();

const onSave = async () => {
  if (!sourceValue.value.filePath) {
    errorMessage("未选择文件")
    return
  }
  await TagFileApiInstance.save(new TagFileEntity(sourceValue.value.tagIds, sourceValue.value.filePath))
  await getTags()
  message()
  emits("success")
}

</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ sourceValue.fileName }}</span>
        <el-button class="button" type="text" @click="onSave">保存</el-button>
      </div>
    </template>
    <el-form label-position="top" size="large">
      <el-form-item label="标签">
        <FileTagsSelect v-model="sourceValue.tagIds"/>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

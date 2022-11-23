<script lang="ts" setup>
import FileTagsSelect from "./FileTagsSelect.vue";
import useTag from "../../hooks/useTag";
import {longTimeFormat} from "../../util/common";
import {FileEntity} from "zhangyida-tools";
import {allFiles, CUSTOM_FORM_JSON, FileTagEntity} from "../../api/file";
import CustomFormItems from "../../components/custom/CustomFormItems.vue";

const {dialog} = require("@electron/remote");
const fs = require('fs');
const props = defineProps<{
  value: FileEntity
}>();

const sourceValue = computed(() => {
  return allFiles.value.find(i => i.filePath === props.value.filePath) || new FileTagEntity()
});

const emits = defineEmits(["success", 'update:value']);
const {ifNewTagThenAdd, getTags} = useTag();

// const onSave = async () => {
//   if (!sourceValue.value.filePath) {
//     errorMessage("未选择文件")
//     return
//   }
//   ifNewTagThenAdd(sourceValue.value.tag)
//   writeToDataFile()
//   message()
//   emits("success")
// }
const sizeArray = ["byte", "kb", "mb", "gb"];
const showSize = computed(() => {
  function divide1024(size: number) {
    return size / 1024;
  }

  let number = sourceValue.value.size || 0;
  if (number === 0) {
    return ``
  }
  let index = 0
  while (number > 1024 && sizeArray[index + 1]) {
    number = divide1024(number)
    index++;
  }
  return `${number.toFixed(2)}${sizeArray[index]}`
});

</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ sourceValue.fileName }}</span>
        <div>
          <!-- btn区域         -->
        </div>
      </div>
    </template>
    <el-form label-position="top" size="large">
      <el-form-item label="标签">
        <FileTagsSelect v-model:value="sourceValue.tag"/>
      </el-form-item>
      <CustomFormItems :config="CUSTOM_FORM_JSON" v-model:form="sourceValue"/>
      <el-form-item label="文件路径">
        {{ sourceValue.filePath }}
      </el-form-item>
      <el-form-item label="文件大小">
        {{ showSize }}
      </el-form-item>
      <el-form-item label="创建时间">
        {{ longTimeFormat(sourceValue.createTime) }}
      </el-form-item>
      <el-form-item label="更新时间">
        {{ longTimeFormat(sourceValue.lastUpdateTime) }}
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

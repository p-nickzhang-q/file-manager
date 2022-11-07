<script lang="ts" setup>
import FileTagsSelect from "./FileTagsSelect.vue";
import useTag from "../../hooks/useTag";
import {errorMessage, longTimeFormat, message, shallowCopy} from "../../util/common";
import {FileEntity} from "zhangyida-tools";
import {allFiles, fetchWithDisk, FileTagEntity, updateFileEntity, writeToDataFile} from "../../api/file";
import {ElNotification} from "element-plus";

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

const onExport = async () => {
  // @ts-ignore
  const {fileName, tag, desc, oriurl} = sourceValue.value;
  const fileEntities = await fetchWithDisk(sourceValue.value.filePath);

  const json = {
    folderName: fileName,
    labels: tag,
    desc,
    oriurl,
    files: fileEntities.filter((value: FileTagEntity) => value.isFile()).map((value: FileTagEntity) => {
      return {
        name: value.name || value.fileName,
        oriname: value.fileName,
        desc: value.desc,
        labels: value.tag
      }
    })
  }

  const string = dialog.showSaveDialogSync({
    title: "导出路径",
    filters: [{
      name: 'json', extensions: ['json']
    }]
  });
  if (string) {
    fs.writeFileSync(string, JSON.stringify(json))
    ElNotification.success({
      message: '导出成功'
    })
  }
}

</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ sourceValue.fileName }}</span>
        <div>
<!--          <el-button class="button" type="text" @click="onSave">保存</el-button>-->
          <el-button class="button" type="text" v-show="sourceValue.isDirectory()" @click="onExport">导出json</el-button>
        </div>
      </div>
    </template>
    <el-form label-position="top" size="large">
      <el-form-item label="标签">
        <FileTagsSelect v-model:value="sourceValue.tag"/>
      </el-form-item>
      <el-form-item label="展示名">
        <el-input v-model="sourceValue.name"/>
      </el-form-item>
      <el-form-item label="原地址">
        <el-input v-model="sourceValue.oriurl"/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="sourceValue.desc" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"/>
      </el-form-item>
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

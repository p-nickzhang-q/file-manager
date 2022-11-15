<script lang="ts" setup>
import BasicDialog from "../../components/BasicDialog.vue";
import BasicSelect from "../../components/BasicSelect.vue";
import {allFiles, fileEqual, FileTagEntity, writeToDataFile} from "../../api/file";
import {BaseError} from "../../util/error";
import {shallowCopy} from "../../util/common";
import {ElNotification} from "element-plus";

const dialog = ref();
const data = ref<any[]>([]);
const configJsons = ref<FileTagEntity[]>([]);

const open = (configDiskPaths: any[], jsons: FileTagEntity[]) => {
  dialog.value.open()
  data.value = configDiskPaths
  configJsons.value = jsons
}

const diskOptions = computed(() => {
  return allFiles.value.filter(v => v.type === 'disk').map(v => v.filePath)
});

const onSave = () => {
  // 4 确定盘符匹配
  for (let {filePath, newFilePath} of data.value) {
    if (!newFilePath) {
      throw new BaseError('本地盘符不能为空')
    }
    // 5 如果变了,将盘符换成新盘符
    if (filePath !== newFilePath) {
      configJsons.value.filter(i => {
        return i.filePath.startsWith(filePath)
      }).forEach(i => {
        i.filePath = i.filePath.replace(filePath, newFilePath)
      })
    }
  }
  // 6 将改后的的信息,比对着,写入本地配置文件中
  for (let configFile of configJsons.value) {
    const find = allFiles.value.find(v => {
      return fileEqual(configFile, v)
    });
    if (find) {
      shallowCopy(configFile, find, ['desc', 'tag'])
    }
  }

  writeToDataFile()
  ElNotification.success({message: '保存成功', duration: 1000})
  dialog.value.close()
}

defineExpose({
  open
})
</script>

<template>
  <BasicDialog title="盘符对应" ref="dialog">
    <el-table :data="data" table-layout="fixed">
      <el-table-column label="配置中的盘符" prop="filePath"/>
      <el-table-column label="本地盘符">
        <template #default="{row}">
          <BasicSelect v-model="row.newFilePath" :options="diskOptions"/>
        </template>
      </el-table-column>
    </el-table>
    <template #button>
      <el-button @click="onSave">确认</el-button>
    </template>
  </BasicDialog>
</template>

<style scoped>

</style>

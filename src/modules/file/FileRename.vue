<script lang="ts" setup>

import BasicDialog from "../../components/BasicDialog.vue";
import {FileTagEntity, OPERATION, syncDataJson} from "../../api/file";

const newName = ref<string>();
const newNameFile = ref<FileTagEntity>(new FileTagEntity());
const dialog = ref();

const handleRename = async () => {
  if (newName.value) {
    const oldPath = newNameFile.value.filePath;
    newNameFile.value.rename(newName.value)
    syncDataJson(oldPath, newNameFile.value, OPERATION.RENAME)
    dialog.value.close()
  }
}

defineExpose({
  open(file: FileTagEntity) {
    newNameFile.value = file
    newName.value = file.fileName
    dialog.value.open()
  }
})
</script>

<template>
  <BasicDialog ref="dialog" title="重命名">
    <el-form>
      <el-form-item>
        <el-input v-model="newName"/>
      </el-form-item>
    </el-form>
    <template #button>
      <el-button @click="handleRename">确认</el-button>
    </template>
  </BasicDialog>
</template>

<style scoped>

</style>

<template>
  <el-tabs v-model="active" type="border-card">
    <el-tab-pane label="文件" name="file">
      <FileMain ref="fileMain"/>
    </el-tab-pane>
    <el-tab-pane label="查询" name="tag">
      <Search @openNewTap="handleOpen"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import FileMain from "./modules/file/FileMain.vue";
import Search from "./modules/tag/Search.vue";
import {writeToDataFile} from "./api/file";

const active = ref("file");
const fileMain = ref<any>();
const handleOpen = (path: string) => {
  active.value = "file";
  fileMain.value.addNewTab(path)
}

window.onbeforeunload = (e) => {
  // 不关闭窗口
  // e.returnValue = false;
  writeToDataFile()
}


</script>

<style>
.el-card {
  text-align: center;
}
</style>

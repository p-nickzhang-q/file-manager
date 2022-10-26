<template>
  <el-tabs v-model="active" type="border-card">
    <el-tab-pane label="文件" name="file">
      <FileMain ref="fileMain"/>
    </el-tab-pane>
    <el-tab-pane label="标签" name="tag">
      <TagMain @openNewTap="handleOpen"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import FileMain from "./modules/file/FileMain.vue";
import TagMain from "./modules/tag/TagMain.vue";

const active = ref("file");
const fileMain = ref<any>();
const handleOpen = (path: string) => {
  active.value = "file";
  fileMain.value.addNewTab(path)
}
</script>

<style>
.el-card {
  text-align: center;
}
</style>

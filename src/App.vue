<template>
  <el-tabs type="border-card">
    <el-tab-pane label="文件">
      <FileMain />
    </el-tab-pane>
    <el-tab-pane label="标签">
      <TagMain />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>

import FileMain from "./modules/file/FileMain.vue";
import TagMain from "./modules/tag/TagMain.vue";
</script>

<style>
.el-card {
  text-align: center;
}
</style>

<script lang="ts" setup>
import {Folder, Document, Box} from '@element-plus/icons-vue'
import {FileEntity} from "zhangyida-tools";
defineProps({
  file: FileEntity
});
</script>

<template>
  <el-icon :size="30">
    <box v-if="file.isDisk()"/>
    <folder v-else-if="file.isDirectory()"/>
    <document v-else/>
  </el-icon>
</template>

<style scoped>

</style>

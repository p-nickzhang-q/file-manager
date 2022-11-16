<script lang="ts" setup>
import {Folder, Document, Box} from '@element-plus/icons-vue'
import {FileTagEntity} from "../api/file";

defineProps({
  file: FileTagEntity
});

</script>

<template>
  <el-badge v-if="file.isDisk()" is-dot :type="file.isOnline ? 'success':'info' ">
    <el-icon :size="30">
      <box/>
    </el-icon>
  </el-badge>
  <el-icon v-else :size="30">
    <folder v-if="file.isDirectory()"/>
    <document v-else/>
  </el-icon>
</template>

<style scoped>

</style>

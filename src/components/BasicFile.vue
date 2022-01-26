<script lang="ts" setup>

import {FileEntity} from "../api/fileApi";
import BasicFileIcon from "./BasicFileIcon.vue";

withDefaults(defineProps<{
  file?: FileEntity
}>(), {});
</script>

<template>
  <el-card shadow="hover">
    <slot>
      <BasicFileIcon :file="file"/>
      <div>
        <span>{{ file.fileName }}</span>
      </div>
    </slot>
  </el-card>
</template>

<style scoped>

</style>

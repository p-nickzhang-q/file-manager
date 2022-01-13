<script lang="ts" setup>
import {FileEntity} from "../../api/fileApi";
import FileTagsSelect from "./FileTagsSelect.vue";

const props = defineProps<{
  file: FileEntity
}>();
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ file.fileName }}</span>
      </div>
    </template>
    <el-form label-position="top" size="large">
      <el-form-item label="标签">
        <FileTagsSelect/>
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

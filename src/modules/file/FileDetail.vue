<script lang="ts" setup>
import {FileEntity} from "../../api/fileApi";

const props = defineProps<{
  file: FileEntity
}>();
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>{{ file.fileName }}</span>
        <!--        <el-button class="button" type="text">Operation button</el-button>-->
      </div>
    </template>
    <el-form>
      <el-form-item label="标签"></el-form-item>
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

<script lang="ts" setup>
import FileTagsSelect from "../file/FileTagsSelect.vue";
import {ref} from "vue";
import {TagFileApiInstance, TagFileEntity} from "../../api/tagApi";
import BasicFile from "../../components/BasicFile.vue";
import BasicFileIcon from "../../components/BasicFileIcon.vue";
import FileDetail from "../file/FileDetail.vue";
import useFile from "../../hooks/useFile";
import {FileEntity} from "../../api/fileApi";

const currentFile = ref<FileEntity>(new FileEntity())
const tagIds = ref<string[]>([]);
const content = ref<TagFileEntity[]>([]);
const loading = ref(false);
const onSearch = async () => {
  if (tagIds.value.length > 0) {
    loading.value = true;
    content.value = await TagFileApiInstance.fetch(tagIds.value);
    loading.value = false
  }
}
const onViewDetail = (row: TagFileEntity) => {
  row.file.tagIds = row.tagIds;
  currentFile.value = row.file;
}

</script>

<template>
  <el-form>
    <el-row :gutter="10">
      <el-col :span="22">
        <el-form-item>
          <FileTagsSelect v-model:value="tagIds"/>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-button @click="onSearch">查询</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-divider content-position="left"></el-divider>
  <el-row>
    <el-col :span="16">
      <el-table :data="content" style="width: 100%" v-loading="loading" @row-click="onViewDetail">
        <el-table-column prop="" label="" width="60">
          <template #default="{row}">
            <BasicFileIcon :file="row.file"/>
          </template>
        </el-table-column>
        <el-table-column prop="file.fileName" label="文件名"/>
        <el-table-column prop="file.filePath" label="路径"/>
        <!--   todo显示标签     -->
      </el-table>
    </el-col>
    <el-col :span="7" :offset="1">
      <FileDetail :value="currentFile" @success="onSearch"/>
    </el-col>
  </el-row>
</template>

<style scoped>
</style>

<script lang="ts" setup>
import FileTagsSelect from "../file/FileTagsSelect.vue";
import {ref} from "vue";
import {TagFileApiInstance, TagFileEntity} from "../../api/tagApi";
import BasicFile from "../../components/BasicFile.vue";
import BasicFileIcon from "../../components/BasicFileIcon.vue";
import FileDetail from "../file/FileDetail.vue";
import {useDelete, useFile} from "../../hooks/useFile";
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import BasicDialog from "../../components/BasicDialog.vue";
import FileTree from "../file/FileTree.vue";
import {useRename} from "../file/useRename";
import {useMove} from "../file/useMove";
import {useCopy} from "../file/useCopy";

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
const emits = defineEmits(["openNewTap"]);
const {handleDelete} = useDelete(() => onSearch());
const {newName, handleRename, openRename, renameDialog} = useRename({getData: onSearch, currentPath: ref("")});
const {onMoveTreeNodeClick, handleMove, openMove, moveDialog} = useMove({getData: onSearch, currentPath: ref("")});
const {handleCopy, onCopyTreeNodeClick, openCopy, copyDialog} = useCopy({getData: onSearch, currentPath: ref("")});
const handleOpen = async (file: FileEntity) => {
  if (file.isFile) {
    await FileApiInstance.open(file.filePath)
  } else {
    await emits('openNewTap', file.filePath)
  }
}
</script>

<template>
  <el-form>
    <el-row :gutter="10">
      <el-col :span="23">
        <el-form-item>
          <FileTagsSelect v-model:value="tagIds"/>
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <el-form-item>
          <el-button @click="onSearch">查询</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-divider content-position="left">❥(^_-)</el-divider>
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
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button type="text" @click="handleOpen(row.file)">打开</el-button>
            <el-button type="text" @click="openRename(row.file)">重命名</el-button>
            <el-button type="text" @click="openMove(row.file)">移动</el-button>
            <el-button type="text" @click="openCopy(row.file)">复制</el-button>
            <el-button type="text" @click="handleDelete(row.file)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="7" :offset="1">
      <FileDetail :value="currentFile" @success="onSearch"/>
    </el-col>
  </el-row>
  <BasicDialog ref="renameDialog" title="重命名">
    <el-form>
      <el-form-item>
        <el-input v-model="newName"/>
      </el-form-item>
    </el-form>
    <template #button>
      <el-button @click="handleRename">确认</el-button>
    </template>
  </BasicDialog>
  <BasicDialog title="移动" ref="moveDialog">
    <FileTree @onNodeClick="onMoveTreeNodeClick"/>
    <template #button>
      <el-button @click="handleMove">确认</el-button>
    </template>
  </BasicDialog>
  <BasicDialog title="复制" ref="copyDialog">
    <FileTree @onNodeClick="onCopyTreeNodeClick"/>
    <template #button>
      <el-button @click="handleCopy">确认</el-button>
    </template>
  </BasicDialog>
</template>

<style scoped>
</style>

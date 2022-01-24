<script lang="ts" setup>
import {reactive, ref} from "vue";
import {Folder, Document, Box} from '@element-plus/icons-vue'
import BasicFile from "../../components/BasicFile.vue";
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import BasicBreadcrumb from "../../components/BasicBreadcrumb.vue";
import {useDelete, useFile} from "../../hooks/useFile";
import FileDetail from "./FileDetail.vue";
import useMouseOptions from "../../hooks/useMouseOptions";
import BasicDialog from "../../components/BasicDialog.vue";
import {confirm, errorMessage} from "../../util/common";
import {useRename} from "./useRename";
import FileTree from "./FileTree.vue";
import {useMove} from "./useMove";
import {useCopy} from "./useCopy";

const props = defineProps<{
  tab: string,
  path?: string
}>();

const {
  items,
  getData,
  onGoTo,
  fileLoading,
  currentFile,
  onViewDetail,
  currentPath,
  handleOpenOnNewTab,
} = useFile(props.tab!);
const {handleDelete} = useDelete(() => getData(currentPath.value));
const {renameDialog, newName, openRename, handleRename} = useRename({getData, currentPath});

const {moveDialog, onMoveTreeNodeClick, handleMove, openMove} = useMove({getData, currentPath});

const {copyDialog, handleCopy, onCopyTreeNodeClick, openCopy} = useCopy({getData, currentPath});


const {getMouseOptions} = useMouseOptions<FileEntity>([
  {
    label: "重命名",
    fn: openRename
  },
  {
    label: "移动",
    fn: openMove
  },
  {
    label: "复制",
    fn: openCopy
  },
  {
    label: "删除",
    fn: handleDelete
  },
  {
    label: "新标签打开",
    fn: handleOpenOnNewTab
  }
]);


getData(props.path)
</script>

<template>
  <BasicBreadcrumb :tab="tab"/>
  <br>
  <el-row :gutter="10">
    <el-col :span="16" v-loading="fileLoading">
      <el-row align="middle" v-for="(item,i) of items" :key="item.filePath">
        <BasicFile style="width: 100%;" :file="item"
                   v-mouse-menu="getMouseOptions(item)"
                   @click="onViewDetail(item)"
                   @dblclick.native="onGoTo(item.filePath,false,!item.isDisk && !item.isDirectory)">
        </BasicFile>
      </el-row>
    </el-col>
    <el-col :span="8">
      <FileDetail :value="currentFile" @success="getData(currentPath)"/>
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
.el-row {
  margin-bottom: 20px;
}
</style>

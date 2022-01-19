<script lang="ts" setup>
import {reactive, ref} from "vue";
import {Folder, Document, Box} from '@element-plus/icons-vue'
import BasicFile from "../../components/BasicFile.vue";
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import BasicBreadcrumb from "../../components/BasicBreadcrumb.vue";
import useFile from "../../hooks/useFile";
import FileDetail from "./FileDetail.vue";
import useMouseOptions from "../../hooks/useMouseOptions";
import BasicDialog from "../../components/BasicDialog.vue";
import {confirm, errorMessage} from "../../util/common";
import {useRename} from "./useRename";
import FileTree from "./FileTree.vue";
import {useMove} from "./useMove";
import {useCopy} from "./useCopy";

const props = defineProps({
  tab: String
});

const {items, getData, onGoTo, fileLoading, currentFile, onViewDetail, currentPath} = useFile(props.tab!);
const {renameDialog, newName, newNameFile, handleRename} = useRename(getData, currentPath);

const {moveDialog, moveFile, onMoveTreeNodeClick, handleMove} = useMove(getData, currentPath);

const {copyDialog, copyFile, handleCopy, onCopyTreeNodeClick} = useCopy(getData, currentPath);
const {getMouseOptions} = useMouseOptions<FileEntity>([
  {
    label: "重命名",
    fn: t => {
      renameDialog.value.open()
      newNameFile.value = t;
      newName.value = t.fileName
    }
  },
  {
    label: "移动",
    fn: t => {
      moveDialog.value.open()
      moveFile.value = t
    }
  },
  {
    label: "复制",
    fn: t => {
      copyDialog.value.open()
      copyFile.value = t
    }
  },
  {
    label: "删除",
    fn: async (t) => {
      await confirm("确认删除吗")
      await FileApiInstance.delete(t)
      await getData(currentPath.value)
    }
  },
]);


getData()
</script>

<template>
  <BasicBreadcrumb :tab="tab"/>
  <br>
  <el-row :gutter="10">
    <el-col :span="16" v-loading="fileLoading">
      <el-row align="middle" v-for="(item,i) of items" :key="item.filePath">
        <BasicFile style="width: 100%;" :name="item.fileName"
                   v-mouse-menu="getMouseOptions(item)"
                   @click="onViewDetail(item)"
                   @dblclick.native="onGoTo(item.filePath,false,!item.isDisk && !item.isDirectory)">
          <template #icon>
            <box v-if="item.isDisk"/>
            <folder v-else-if="item.isDirectory"/>
            <document v-else/>
          </template>
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

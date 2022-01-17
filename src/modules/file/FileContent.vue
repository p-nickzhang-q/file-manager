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
import {confirm} from "../../util/common";
import useRename from "./useRename";

const props = defineProps({
  tab: String
});

const {items, getData, onGoTo, fileLoading, currentFile, onViewDetail, currentPath} = useFile(props.tab!);

const {renameDialog, newName, getMouseOptions, handleRename} = useRename(getData, currentPath);


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
      <FileDetail :file="currentFile"/>
    </el-col>
  </el-row>
  <BasicDialog ref="renameDialog" title="重命名">
    <el-form>
      <el-form-item>
        <el-input v-model="newName"/>
      </el-form-item>
    </el-form>
    <template #button>
      <el-button @click="handleRename">保存</el-button>
    </template>
  </BasicDialog>
</template>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>

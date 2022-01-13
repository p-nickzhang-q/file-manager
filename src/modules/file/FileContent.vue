<script lang="ts" setup>
import {reactive, ref} from "vue";
import {Folder, Document, Box} from '@element-plus/icons-vue'
import BasicFile from "../../components/BasicFile.vue";
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import BasicBreadcrumb from "../../components/BasicBreadcrumb.vue";
import useFile from "../../hooks/useFile";
import FileDetail from "./FileDetail.vue";

const props = defineProps({
  tab: String
});

const {items, getData, onGoTo, fileLoading, currentFile, onViewDetail} = useFile(props.tab!);


getData()
</script>

<template>
  <BasicBreadcrumb :tab="tab"/>
  <br>
  <el-row :gutter="10">
    <el-col :span="16">
      <el-row :gutter="10" align="middle" v-loading="fileLoading">
        <el-col :span="3" v-for="(item,i) of items" :key="i">
          <BasicFile :name="item.fileName"
                     @click="onViewDetail(item)"
                     @dblclick.native="onGoTo(item.filePath,false,!item.isDisk && !item.isDirectory)">
            <template #icon>
              <box v-if="item.isDisk"/>
              <folder v-else-if="item.isDirectory"/>
              <document v-else/>
            </template>
          </BasicFile>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="8">
      <FileDetail :file="currentFile"/>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>

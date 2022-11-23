<script lang="ts" setup>
import FileTagsSelect from "../file/FileTagsSelect.vue";
import FileDetail from "../file/FileDetail.vue";
import {useDelete, useFile} from "../../hooks/useFile";
import BasicDialog from "../../components/BasicDialog.vue";
import {useCopy} from "../file/useCopy";
import TagManage from "./TagManage.vue";
import {FileEntity} from "zhangyida-tools";
import {allFiles, FileTagEntity} from "../../api/file";
import BasicFile from "../../components/BasicFile.vue";
import useMenu from "../../hooks/useMenu";
import BasicScrollbar from "../../components/BasicScrollbar.vue";
import FileTagBulkAdd from '../file/FileTagBulkAdd.vue'
import FileLayoutSelect from "../file/FileLayoutSelect.vue";
import FileSort from "../file/FileSort.vue";
import FileRename from "../file/FileRename.vue";

/**
 * todo
 * 查询自定义字段
 * 回家看看会不会掉数据
 */
const {FileEntity: File} = require('zhangyida-tools');

const tags = ref<string[]>([]);
const onSearch = async () => {
  if (tags.value.length > 0) {
    items.value = allFiles.value.filter(i => {
      return tags.value.every(tag => {
        return i.tag.includes(tag)
      })
    })
  }
}
const emits = defineEmits(["openNewTap", "goto"]);
const tabName = "tagMange";
const {
  items,
  getData,
  onGoTo,
  fileLoading,
  currentFile,
  onViewDetail,
  currentPath,
  selectedFiles,
  layout,
  sorts
} = useFile(tabName, emits);
const {handleDelete} = useDelete(() => onSearch());
const {openCopy} = useCopy({getData: onSearch, currentPath: ref("")});

const {popup, fileTagBulkAdd, fileRename} = useMenu({tab: tabName, emits});

const handleFileContentMenu = (item: FileTagEntity) => {
  popup(item)
}

const onClear = () => {
  items.value = [];
  tags.value = [];
}

const tabManageDialog = ref<any>(null);
const tabManage = ref<any>(null);
const openTagManage = async () => {
  tabManageDialog.value.open()
  await nextTick(async () => {
    await tabManage.value.getTags()
  })
}

</script>

<template>
  <el-form>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item>
          <FileTagsSelect v-model:value="tags"/>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-button @click="onSearch">查询</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-row>
          <el-button style="margin-right: 10px" @click="openTagManage" @clear="onClear">标签管理</el-button>
          <FileLayoutSelect v-model:value="layout" style="padding-right: 10px"/>
          <FileSort v-model:model-value="sorts" style="padding-right: 10px"/>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
  <el-divider content-position="center">Jenny & Nick</el-divider>
  <el-row>
    <el-col :span="16" v-loading="fileLoading">
      <BasicScrollbar>
        <div>
          <el-row align="middle" :gutter="5">
            <el-col :span="layout" v-for="(item,i) of items" :key="item.filePath">
              <BasicFile :file="item"
                         :tab="tabName"
                         @contextmenu.prevent="handleFileContentMenu(item)"
                         @click.prevent="onViewDetail(item,i)"
                         @dblclick.prevent="onGoTo(item.filePath,false,item.isOnline)"/>
            </el-col>
          </el-row>
        </div>
      </BasicScrollbar>
    </el-col>
    <el-col :span="7" :offset="1">
      <FileDetail :value="currentFile" @success="onSearch"/>
    </el-col>
  </el-row>
  <FileRename ref="fileRename"/>
  <BasicDialog title="标签管理" ref="tabManageDialog">
    <TagManage ref="tabManage"/>
  </BasicDialog>
  <FileTagBulkAdd ref="fileTagBulkAdd" @success="onSearch()"/>
</template>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>

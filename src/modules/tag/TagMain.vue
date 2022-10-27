<script lang="ts" setup>
import FileTagsSelect from "../file/FileTagsSelect.vue";
import BasicFileIcon from "../../components/BasicFileIcon.vue";
import FileDetail from "../file/FileDetail.vue";
import {useDelete} from "../../hooks/useFile";
import BasicDialog from "../../components/BasicDialog.vue";
import {useRename} from "../file/useRename";
import {useMove} from "../file/useMove";
import {useCopy} from "../file/useCopy";
import TagManage from "./TagManage.vue";
import {FileEntity} from "zhangyida-tools";
import {allFiles} from "../../api/file";

const {FileEntity: File} = require('zhangyida-tools');

const currentFile = ref<FileEntity>(new FileEntity())
const tags = ref<string[]>([]);
const content = ref<FileEntity[]>([]);
const loading = ref(false);
const onSearch = async () => {
  if (tags.value.length > 0) {
    content.value = allFiles.value.filter(i => {
      return tags.value.every(tag => {
        // @ts-ignore
        return i.tag.includes(tag)
      })
    }).map(i => File.ofJson(i))
  }
}
const onViewDetail = (row: any) => {
  currentFile.value = row;
}
const emits = defineEmits(["openNewTap"]);
const {handleDelete} = useDelete(() => onSearch());
const {newName, handleRename, openRename, renameDialog} = useRename({getData: onSearch, currentPath: ref("")});
const {openMove} = useMove({getData: onSearch, currentPath: ref("")});
const {openCopy} = useCopy({getData: onSearch, currentPath: ref("")});
const handleOpen = async (file: FileEntity) => {
  if (file.isFile()) {
    await file.open()
  } else {
    await emits('openNewTap', file.filePath)
  }
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
      <el-col :span="20">
        <el-form-item>
          <FileTagsSelect v-model:value="tags"/>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-button @click="onSearch">查询</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-button @click="openTagManage">标签管理</el-button>
      </el-col>
    </el-row>
  </el-form>
  <el-divider content-position="center">Jenny & Nick</el-divider>
  <el-row>
    <el-col :span="16">
      <el-table border :data="content" style="width: 100%" v-loading="loading" @row-click="onViewDetail">
        <el-table-column prop="" label="" width="60">
          <template #default="{row}">
            <BasicFileIcon :file="row"/>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" width="150" label="文件名"/>
        <el-table-column prop="filePath" label="路径"/>
        <!--   todo显示标签     -->
        <el-table-column label="操作" width="250">
          <template #default="{row}">
            <el-button type="text" @click="handleOpen(row)">打开</el-button>
            <el-button type="text" @click="openRename(row)">重命名</el-button>
            <el-button type="text" @click="openMove(row)">移动</el-button>
            <el-button type="text" @click="openCopy(row)">复制</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
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
  <BasicDialog title="标签管理" ref="tabManageDialog">
    <TagManage ref="tabManage"/>
  </BasicDialog>
</template>

<style scoped>
</style>

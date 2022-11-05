<script lang="ts" setup>
import FileTagsSelect from "../file/FileTagsSelect.vue";
import BasicFileIcon from "../../components/BasicFileIcon.vue";
import FileDetail from "../file/FileDetail.vue";
import {isShift, isCtrl, useDelete, useFile} from "../../hooks/useFile";
import BasicDialog from "../../components/BasicDialog.vue";
import {useRename} from "../file/useRename";
import {useMove} from "../file/useMove";
import {useCopy} from "../file/useCopy";
import TagManage from "./TagManage.vue";
import {FileEntity} from "zhangyida-tools";
import {allFiles, FileTagEntity} from "../../api/file";
import BasicFile from "../../components/BasicFile.vue";
import useMenu from "../../hooks/useMenu";
import BasicScrollbar from "../../components/BasicScrollbar.vue";

const {FileEntity: File} = require('zhangyida-tools');

const tags = ref<string[]>([]);
const onSearch = async () => {
  if (tags.value.length > 0) {
    items.value = allFiles.value.filter(i => {
      return tags.value.every(tag => {
        // @ts-ignore
        return i.tag.includes(tag)
      })
    }).map(i => File.ofJson(i))
  }
}
const emits = defineEmits(["openNewTap", "goto"]);
const {
  items,
  getData,
  onGoTo,
  fileLoading,
  currentFile,
  onViewDetail,
  currentPath,
  selectedFiles
} = useFile("tagMange", emits);
const {handleDelete} = useDelete(() => onSearch());
const {newName, handleRename, openRename, renameDialog} = useRename({getData: onSearch, currentPath: ref("")});
const {openMove} = useMove({getData: onSearch, currentPath: ref("")});
const {openCopy} = useCopy({getData: onSearch, currentPath: ref("")});

const {buildMouseMenu, popup} = useMenu();

const menu = buildMouseMenu({
  openRename, openMove, openCopy, handleDelete, openNewTap(items: FileEntity[]) {
    for (let item of items) {
      emits('openNewTap', item.filePath)
    }
  }, openInFileExplore(item: FileEntity) {
    item.open()
  },
  bulkAddTag(items: FileTagEntity[]) {
    //todo
  }
});

const handleFileContentMenu = (item: FileEntity) => {
  popup(menu, item, selectedFiles.value)
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
        <el-button @click="openTagManage" @clear="onClear">标签管理</el-button>
      </el-col>
    </el-row>
  </el-form>
  <el-divider content-position="center">Jenny & Nick</el-divider>
  <el-row>
    <el-col :span="16" v-loading="fileLoading">
      <BasicScrollbar>
        <el-row align="middle" v-for="(item,i) of items" :key="item.filePath">
          <BasicFile style="width: 100%;" :file="item"
                     @contextmenu.prevent="handleFileContentMenu(item)"
                     @click.prevent="onViewDetail(item,i)"
                     @dblclick.prevent="onGoTo(item.filePath,false)">
          </BasicFile>
        </el-row>
      </BasicScrollbar>
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
.el-row {
  margin-bottom: 20px;
}
</style>

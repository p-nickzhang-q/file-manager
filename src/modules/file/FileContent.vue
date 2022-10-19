<script lang="ts" setup>
import {reactive, ref} from "vue";
import {Folder, Document, Box, Search} from '@element-plus/icons-vue'
import BasicFile from "../../components/BasicFile.vue";
import BasicBreadcrumb from "../../components/BasicBreadcrumb.vue";
import {useDelete, useFile} from "../../hooks/useFile";
import FileDetail from "./FileDetail.vue";
import BasicDialog from "../../components/BasicDialog.vue";
import {confirm, errorMessage} from "../../util/common";
import {useRename} from "./useRename";
import FileTree from "./FileTree.vue";
import {useMove} from "./useMove";
import {useCopy} from "./useCopy";
import BasicScrollbar from "../../components/BasicScrollbar.vue";
import {FileEntity} from "zhangyida-tools";
import {popup, useMouseOptions} from "../../hooks/useMouseOptions";

const props = defineProps<{
  tab: string,
  path?: string
}>();
const emits = defineEmits(["openNewTap", "goto"]);

const {
  items,
  getData,
  onGoTo,
  fileLoading,
  currentFile,
  onViewDetail,
  currentPath,
  searchValue,
  onSearch,
  emitGoto
} = useFile(props.tab!, emits);
const {handleDelete} = useDelete(() => getData(currentPath.value));
const {renameDialog, newName, openRename, handleRename} = useRename({getData, currentPath});

const {moveDialog, onMoveTreeNodeClick, handleMove, openMove} = useMove({getData, currentPath});

const {copyDialog, handleCopy, onCopyTreeNodeClick, openCopy} = useCopy({getData, currentPath});


// const {getMouseOptions} = useMouseOptions<FileEntity>([
//   {
//     label: "重命名",
//     fn: openRename
//   },
//   {
//     label: "移动",
//     fn: openMove
//   },
//   {
//     label: "复制",
//     fn: openCopy
//   },
//   {
//     label: "删除",
//     fn: handleDelete
//   },
//   {
//     label: "新标签打开",
//     fn: t => {
//       emits('openNewTap', t.filePath)
//     }
//   }
// ]);
const menu = useMouseOptions([
  {label: '重命名'},
  {label: '复制'},
  {label: '粘贴'},
  {label: '删除'},
  {label: '新标签打开'},
]);

const handleFileContentMenu = (item: FileEntity) => {
  if (!item.isDisk()) {
    popup(menu)
  }
}

getData(props.path)

</script>

<template>
  <BasicBreadcrumb :tab="tab" @goto="emitGoto($event)"/>
  <br>
  <el-row :gutter="10">
    <el-col :span="16" v-loading="fileLoading">
      <BasicScrollbar>
        <div>
          <el-row align="middle" v-for="(item,i) of items" :key="item.filePath">
            <BasicFile style="width: 100%;" :file="item"
                       @contextmenu.prevent="handleFileContentMenu(item)"
                       @click="onViewDetail(item)"
                       @dblclick="onGoTo(item.filePath,false,!item.isDisk() && !item.isDirectory())">
            </BasicFile>
          </el-row>
        </div>
      </BasicScrollbar>
    </el-col>
    <el-col :span="8">
      <el-row>
        <el-input
            v-model="searchValue"
            size="large"
            placeholder="搜索"
            :suffix-icon="Search"
            @keyup.enter="onSearch"
        />
      </el-row>
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

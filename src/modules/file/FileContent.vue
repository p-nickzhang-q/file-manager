<script lang="ts" setup>
import {Search} from '@element-plus/icons-vue'
import BasicFile from "../../components/BasicFile.vue";
import BasicBreadcrumb from "../../components/BasicBreadcrumb.vue";
import {useDelete, useFile} from "../../hooks/useFile";
import FileDetail from "./FileDetail.vue";
import BasicDialog from "../../components/BasicDialog.vue";
import {useRename} from "./useRename";
import {useMove} from "./useMove";
import {useCopy} from "./useCopy";
import BasicScrollbar from "../../components/BasicScrollbar.vue";
import {FileEntity} from "zhangyida-tools";
import useMenu from "../../hooks/useMenu";

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
  emitGoto,
  searchMode,
} = useFile(props.tab!, emits);
const {handleDelete} = useDelete(() => getData(currentPath.value));
const {renameDialog, newName, openRename, handleRename} = useRename({getData, currentPath});

const {openMove} = useMove({getData, currentPath});

const {openCopy} = useCopy({getData, currentPath});

const {buildMouseMenu, popup} = useMenu();

const menu = buildMouseMenu({
  openRename, openMove, openCopy, handleDelete, openNewTap(item: FileEntity) {
    emits('openNewTap', item.filePath)
  }
});

const handleFileContentMenu = (item: FileEntity) => {
  if (!item.isDisk()) {
    popup(menu, item)
  }
}

getData(props.path)

</script>

<template>
  <div v-show="searchMode">搜索模式</div>
  <BasicBreadcrumb v-show="!searchMode" :tab="tab" @goto="emitGoto($event)"/>
  <br>
  <el-row :gutter="10">
    <el-col :span="16" v-loading="fileLoading">
      <BasicScrollbar>
        <div>
          <el-row align="middle" v-for="(item,i) of items" :key="item.filePath">
            <BasicFile style="width: 100%;" :file="item"
                       @contextmenu.prevent="handleFileContentMenu(item)"
                       @click.prevent="onViewDetail(item)"
                       @dblclick.prevent="onGoTo(item.filePath,false)">
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
            clearable
            @clear="onSearch"
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
</template>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>

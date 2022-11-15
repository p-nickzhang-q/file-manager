<script lang="ts" setup>
import {Search, ArrowLeftBold, ArrowRightBold, Refresh} from '@element-plus/icons-vue'
import BasicFile from "../../components/BasicFile.vue";
import BasicBreadcrumb from "../../components/BasicBreadcrumb.vue";
import {exportToXlsx, useDelete, useFile} from "../../hooks/useFile";
import FileDetail from "./FileDetail.vue";
import BasicDialog from "../../components/BasicDialog.vue";
import {useRename} from "./useRename";
import {useMove} from "./useMove";
import {useCopy} from "./useCopy";
import BasicScrollbar from "../../components/BasicScrollbar.vue";
import {FileEntity} from "zhangyida-tools";
import useMenu, {useContextMenu} from "../../hooks/useMenu";
import FileSort from "./FileSort.vue";
import {ElNotification} from "element-plus";
import FileTagBulkAdd from "./FileTagBulkAdd.vue";
import {useBulkAddTag} from "./useBulkAddTag";
import FileLayoutSelect from "./FileLayoutSelect.vue";
import DiskMatch from "./DiskMatch.vue";

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
  selectedFiles,
  sorts,
  goForward,
  goBack,
  layout,
  diskMatch
} = useFile(props.tab!, emits);
const {handleDelete} = useDelete(() => getData(currentPath.value));
const {renameDialog, newName, openRename, handleRename} = useRename({getData, currentPath});

const {openMove} = useMove({getData, currentPath});

const {openCopy} = useCopy({getData, currentPath});

const {buildMouseMenu, popup} = useMenu();

const {popup: ContentPopup} = useContextMenu({
  tab: props.tab,
  emits
});

const {openBulkAddTag, fileTagBulkAdd} = useBulkAddTag();

const menu = buildMouseMenu({
  openRename, openMove, openCopy, handleDelete, openNewTap(items: FileEntity[]) {
    for (let item of items) {
      emits('openNewTap', item.filePath)
    }
  }, openInFileExplore(item: FileEntity) {
    item.open()
  }, bulkAddTag: openBulkAddTag
});

const handleFileContentMenu = (item: FileEntity) => {
  popup(menu, item, selectedFiles.value)
}

const onRefresh = async () => {
  await getData(currentPath.value)
  ElNotification.success({message: '刷新成功', duration: 1000})
}


getData(props.path)

</script>

<template>
  <!-- 导航栏 -->
  <div @contextmenu="ContentPopup()">
    <div style="display: flex">
      <div>
        <el-button circle :icon="ArrowLeftBold" @click="goBack"/>
        <el-button circle :icon="ArrowRightBold" @click="goForward"/>
      </div>
      <el-divider style="padding-top: 20px" direction="vertical"/>
      <div style="padding-right: 10px;padding-top: 10px">
        <div v-show="searchMode">搜索模式</div>
        <BasicBreadcrumb v-show="!searchMode" :tab="tab" @goto="emitGoto($event)"/>
      </div>
    </div>
    <br>
    <div style="display: flex;justify-content: flex-end">
      <FileLayoutSelect v-model:value="layout" style="padding-right: 10px"/>
      <FileSort v-model:model-value="sorts" style="padding-right: 10px"/>
      <el-button type="primary" round :icon="Refresh" @click="onRefresh"/>
    </div>
    <br>
    <el-row :gutter="10">
      <el-col :span="16" v-loading="fileLoading">
        <BasicScrollbar>
          <div>
            <el-row align="middle" :gutter="5">
              <el-col :span="layout" v-for="(item,i) of items" :key="item.filePath">
                <BasicFile :file="item"
                           @contextmenu.stop="handleFileContentMenu(item)"
                           @click.prevent="onViewDetail(item,i)"
                           @dblclick.prevent="onGoTo(item.filePath,false)"/>
              </el-col>
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
        <br>
        <FileDetail :value="currentFile" @success="getData(currentPath)"/>
      </el-col>
    </el-row>
  </div>
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
  <FileTagBulkAdd ref="fileTagBulkAdd" @success="getData(currentPath)"/>
  <DiskMatch ref="diskMatch"/>
</template>

<style scoped>
.el-col {
  margin-bottom: 20px;
}
</style>

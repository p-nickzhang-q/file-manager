<script lang="ts" setup>
import {ArrowLeftBold, ArrowRightBold, Refresh, Search} from '@element-plus/icons-vue'
import BasicFile from "../../components/BasicFile.vue";
import BasicBreadcrumb from "../../components/BasicBreadcrumb.vue";
import {useFile} from "../../hooks/useFile";
import FileDetail from "./FileDetail.vue";
import BasicScrollbar from "../../components/BasicScrollbar.vue";
import useMenu, {useContextMenu} from "../../hooks/useMenu";
import FileSort from "./FileSort.vue";
import {ElNotification} from "element-plus";
import FileTagBulkAdd from "./FileTagBulkAdd.vue";
import FileLayoutSelect from "./FileLayoutSelect.vue";
import DiskMatch from "./DiskMatch.vue";
import {FileTagEntity} from "../../api/file";
import FileRename from "./FileRename.vue";

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


const {popup, fileRename, fileTagBulkAdd} = useMenu({
  tab: props.tab,
  emits
});

const {popup: ContentPopup} = useContextMenu({
  tab: props.tab,
  emits
});

const handleFileContentMenu = (item: FileTagEntity) => {
  popup(item)
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
                           @dblclick.prevent="onGoTo(item.filePath,false,item.isOnline)"/>
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
  <FileRename ref="fileRename"/>
  <FileTagBulkAdd ref="fileTagBulkAdd" @success="getData(currentPath)"/>
  <DiskMatch ref="diskMatch"/>
</template>

<style scoped>
.el-col {
  margin-bottom: 20px;
}
</style>

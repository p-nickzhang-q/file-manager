<script lang="ts" setup>
import FileTagsSelect from "../file/FileTagsSelect.vue";
import FileDetail from "../file/FileDetail.vue";
import {useDelete, useFile} from "../../hooks/useFile";
import BasicDialog from "../../components/BasicDialog.vue";
import {useCopy} from "../file/useCopy";
import TagManage from "./TagManage.vue";
import {FileEntity} from "zhangyida-tools";
import {allFiles, CUSTOM_SEARCH_FORM_JSON, FileTagEntity, search_field_process} from "../../api/file";
import BasicFile from "../../components/BasicFile.vue";
import useMenu from "../../hooks/useMenu";
import BasicScrollbar from "../../components/BasicScrollbar.vue";
import FileTagBulkAdd from '../file/FileTagBulkAdd.vue'
import FileLayoutSelect from "../file/FileLayoutSelect.vue";
import FileSort from "../file/FileSort.vue";
import FileRename from "../file/FileRename.vue";
import CustomFormItems from "../../components/custom/CustomFormItems.vue";
import {objectHasValue} from "../../util/common";

/**
 * todo
 * 查询自定义字段 √
 * 回家看看会不会掉数据
 * 导出导入添加自定义字段
 */
const {FileEntity: File} = require('zhangyida-tools');

const searchForm = ref<{
  fileName?: string,
  tags: string[]
}>({
  tags: []
});

const onSearch = async () => {
  const {tags, fileName, ...others} = searchForm.value;
  if (tags.length || fileName || objectHasValue(others)) {
    items.value = allFiles.value;
  }
  const tagsFilter = () => {
    if (tags.length > 0) {
      items.value = items.value.filter(i => {
        return tags.every(tag => {
          return i.tag.includes(tag)
        })
      })
    }
  };

  const textFilter = (property: string, value?: string) => {
    if (value) {
      items.value = items.value.filter(i => {
        // @ts-ignore
        return (i[property] ?? '').includes(value)
      })
    }
  };

  const equalFilter = (property: string, value?: any) => {
    if (value) {
      items.value = items.value.filter(i => {
        // @ts-ignore
        return i[property] === value
      })
    }
  };

  tagsFilter();
  textFilter('fileName', fileName)
  for (let [key, value] of Object.entries(others)) {
    const process = search_field_process.get(key);
    if (process) {
      switch (process) {
        case 'equal':
          equalFilter(key, value)
          break;
        default:
          textFilter(key, value as string)
          break;
      }
    }
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
  searchForm.value = {
    tags: []
  };
  currentFile.value = new FileTagEntity()
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
  <el-form label-position="top">
    <el-row :gutter="10">
      <el-col :span="16">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="标签">
              <FileTagsSelect v-model:value="searchForm.tags"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="文件名">
              <el-input v-model="searchForm.fileName" placeholder="文件名"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="2">
        <el-form-item>
          <el-button @click="onSearch">查询</el-button>
          <el-button @click="onClear">重置</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-row>
          <el-col :span="6">
            <el-button style="margin-right: 10px" @click="openTagManage" @clear="onClear">标签管理</el-button>
          </el-col>
          <el-col :span="9">
            <FileLayoutSelect v-model:value="layout" style="padding-right: 10px"/>
          </el-col>
          <el-col :span="9">
            <FileSort v-model:model-value="sorts" style="padding-right: 10px"/>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <CustomFormItems v-model:form="searchForm" :config="CUSTOM_SEARCH_FORM_JSON"/>
  </el-form>
  <el-divider content-position="center">Jenny & Nick</el-divider>
  <el-row>
    <el-col :span="16" v-loading="fileLoading">
      <BasicScrollbar>
        <div>
          <el-row align="middle" :gutter="5">
            <el-col :span="layout" v-for="(item,i) of items" :key="item.filePath">
              <!--  @dblclick.prevent="onGoTo(item.filePath,false,item.isOnline)"            -->
              <BasicFile style="margin-bottom: 20px" :file="item"
                         :tab="tabName"
                         @contextmenu.prevent="handleFileContentMenu(item)"
                         @click.prevent="onViewDetail(item,i)"/>
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

</style>

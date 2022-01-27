<template>
  <el-tabs
      v-model="editableTabsValue"
      type="card"
      editable
      @edit="handleTabsEdit"
  >
    <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
    >
      <FileContent :tab="item.name" :path="item.path" @openNewTap="handleOpenNewTap" @goto="onGoTo($event,item.name)"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import FileContent from "./FileContent.vue";
import {defaultTabTitle, getFileNameByPath} from "../../util/common";

let tabIndex = 0
const editableTabsValue = ref('0')

interface Tab {
  title: string;
  name: string;
  path?: string;
}

const editableTabs = ref<Tab[]>([
  {
    title: defaultTabTitle,
    name: '0',
  },
])

function addNewTab(path?: string) {
  let title: string = getFileNameByPath(path);
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title,
    name: newTabName,
    path
  })
  editableTabsValue.value = newTabName
}

const handleTabsEdit = (targetName: string, action: 'remove' | 'add') => {
  if (action === 'add') {
    addNewTab();
  } else if (action === 'remove') {
    const tabs = editableTabs.value
    let activeName = editableTabsValue.value
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.name
          }
        }
      })
    }

    editableTabsValue.value = activeName
    editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
  }
}

const handleOpenNewTap = (path: string) => {
  addNewTab(path)
}

const onGoTo = (path: string, tabName: string) => {
  const find = editableTabs.value.find(value => value.name === tabName)!;
  find.title = getFileNameByPath(path)
}

defineExpose({
  addNewTab
})
</script>

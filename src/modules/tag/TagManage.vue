<script lang="ts" setup>
import useTag from "../../hooks/useTag";
import {confirm, message} from "../../util/common";
import {useHeight} from "../../hooks/useHeight";

const {getTags: getSelectTags, tagOptions, syncTagData} = useTag();
const getTags = () => {
  getSelectTags();
  for (let i = 0; i < tagOptions.value.length; i++) {
    editMap.value.set(i, {edit: false})
  }
}

defineExpose({
  getTags,
})

const emits = defineEmits(['clear']);

type RowConfig = {
  edit: boolean,
  tag?: string
}
const editMap = ref(new Map<number, RowConfig>([]));


const onEdit = (index: number) => {
  let config = editMap.value.get(index);
  if (!config) {
    config = {edit: false}
    editMap.value.set(index, config)
  }
  config.edit = true
  config.tag = tagOptions.value[index]
}

const save = (index: number) => {
  const config = editMap.value.get(index)!;
  config.edit = false;
  const oldTag = tagOptions.value[index];
  // @ts-ignore
  tagOptions.value[index] = config.tag
  syncTagData({oldTag, newTag: config.tag})
  emits('clear')
  message()
}

const cancel = (index: number) => {
  editMap.value.get(index)!.edit = false;
}

const isEdit = (i: number) => {
  return editMap.value.get(i)!.edit
}

const onDelete = async (i: number) => {
  await confirm("确认删除吗")
  const removeTags = tagOptions.value.splice(i, 1);
  syncTagData({removeTag: removeTags[0]})
  emits('clear')
  message();
}

const {height} = useHeight();

</script>

<template>
  <el-table :max-height="height" :data="tagOptions" border style="width: 100%">
    <el-table-column label="操作">
      <template #default="{row,$index}">
        <div v-if="isEdit($index)">
          <el-button type="text" @click="save($index)">保存</el-button>
          <el-button type="text" @click="cancel($index)">取消</el-button>
        </div>
        <div v-else>
          <el-button type="text" @click="onEdit($index)">编辑</el-button>
          <el-button type="text" @click="onDelete($index)">删除</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="tag" label="标签" align="center">
      <template #default="{row,$index}">
        <el-input v-if="isEdit($index)" v-model="editMap.get($index).tag"/>
        <span v-else>{{ row }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>

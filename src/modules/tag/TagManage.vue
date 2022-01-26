<script lang="ts" setup>
import useTag from "../../hooks/useTag";
import {TagApiInstance, TagEntity} from "../../api/tagApi";
import {deepCopy, message} from "../../util/common";

const tableData = ref<TagEntity[]>([]);
const getTags = async () => {
  tableData.value = await TagApiInstance.fetch();
  for (let i = 0; i < tableData.value.length; i++) {
    editMap.value.set(i, {edit: false})
  }
}

defineExpose({
  getTags,
})


type RowConfig = {
  edit: boolean,
  editTempData?: TagEntity
}
const editMap = ref(new Map<number, RowConfig>([]));

const {getTags: getSelectTags} = useTag();

const onEdit = (index: number, row: TagEntity) => {
  let config = editMap.value.get(index);
  if (!config) {
    config = {edit: false}
    editMap.value.set(index, config)
  }
  config.edit = true
  config.editTempData = deepCopy(row)
}

const save = async (index: number) => {
  const config = editMap.value.get(index)!;
  await TagApiInstance.save(config.editTempData!);
  config.edit = false;
  message()
  await getSelectTags()
  await getTags()
}

const cancel = (index: number) => {
  editMap.value.get(index)!.edit = false;
}

const isEdit = (i: number) => {
  return editMap.value.get(i)!.edit
}

</script>

<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column label="操作">
      <template #default="{row,$index}">
        <div v-if="isEdit($index)">
          <el-button type="text" @click="save($index)">保存</el-button>
          <el-button type="text" @click="cancel($index)">取消</el-button>
        </div>
        <div v-else>
          <el-button type="text" @click="onEdit($index,row)">编辑</el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="value" label="标签" align="center">
      <template #default="{row,$index}">
        <el-input v-if="isEdit($index)" v-model="editMap.get($index).editTempData.value"/>
        <span v-else>{{ row.value }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>

<script lang="ts" setup>
import type Node from 'element-plus/es/components/tree/src/model/node'
import {FileApiInstance, FileEntity} from "../../api/fileApi";
import {useFile} from "../../hooks/useFile";
import {onMounted, ref} from "vue";

const props = {
  label: 'fileName',
  children: 'children',
  isLeaf: 'isFile',
}

const loadNode = async (node: Node, resolve: (data: FileEntity[]) => void) => {
  const filePath = node.data.filePath;
  const fileEntities = await FileApiInstance.fetch(filePath);
  resolve(fileEntities);
}

const selectNode = ref<FileEntity>();
const emits = defineEmits(['onNodeClick']);
const onNodeClick = (data: FileEntity, node: Node, element: any) => {
  selectNode.value = data
  emits("onNodeClick", selectNode.value)
}

</script>

<template>
  <!--  {{ selectNode }}-->
  <el-tree :props="props" :load="loadNode" lazy highlight-current @node-click="onNodeClick"/>
</template>

<style scoped>

</style>

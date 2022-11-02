<script lang="ts" setup>

import BasicFileIcon from "./BasicFileIcon.vue";
import {FileEntity} from "zhangyida-tools";
import {isImage} from "../util/common";

const props = withDefaults(defineProps<{
  file?: FileEntity
}>(), {});

const shadow = computed(() => {
  // @ts-ignore
  return props.file.selected ? 'always' : 'hover'
});

</script>

<template>
  <el-card :shadow="shadow" :class="{'selected':file.selected}">
    <slot>
      <!--      <BasicFileIcon :file="file"/>-->
      <el-image v-if="isImage(file.fileName)" :src="file.filePath" preview-teleported
                :preview-src-list="[file.filePath]"
                style="width: 10%; height: 5%" fit="cover" lazy/>
      <BasicFileIcon v-else :file="file"/>
      <div>
        <span>{{ file.fileName }}</span>
      </div>
    </slot>
  </el-card>
</template>

<style scoped>
.selected {
  background: #d9d9d9;
}
</style>

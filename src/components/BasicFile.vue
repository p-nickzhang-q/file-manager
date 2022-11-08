<script lang="ts" setup>

import BasicFileIcon from "./BasicFileIcon.vue";
import {FileEntity} from "zhangyida-tools";
import {isImage, longTimeFormat} from "../util/common";

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
                style="width: 100%; display: block" fit="cover" lazy/>
      <BasicFileIcon v-else :file="file"/>
      <div>
        <span>{{ file.fileName }}</span>
      </div>
      <!--      <div style="display:flex;">-->
      <!--        <span>创建时间:{{ longTimeFormat(file.createTime) }}</span>-->
      <!--        <div style="width: 100px;"></div>-->
      <!--        <span>更新时间:{{ longTimeFormat(file.lastUpdateTime) }}</span>-->
      <!--      </div>-->
    </slot>
  </el-card>
</template>

<style scoped>
.selected {
  background: #d9d9d9;
}
</style>

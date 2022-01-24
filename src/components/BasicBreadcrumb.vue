<script setup>
import {useFile} from "../hooks/useFile";

const props = defineProps({
  path: String,
  tab: String
});

const {onGoTo, breads} = useFile(props.tab);

</script>

<template>
  <!--  {{ breads }}-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item><a @click="onGoTo()">主页</a></el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item,i) of breads" :key="i"><a @click="onGoTo(item,true)">{{ item }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>

</style>

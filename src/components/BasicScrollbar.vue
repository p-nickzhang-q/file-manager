<script lang="ts" setup>
import {useHeight} from "../hooks/useHeight";

const {height} = useHeight();
</script>

<template>
  <el-scrollbar :height="height">
    <slot></slot>
  </el-scrollbar>
</template>

<style scoped>

</style>

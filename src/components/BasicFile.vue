<script lang="ts" setup>
import {defineProps} from "vue";

defineProps({
  name: String
});
</script>

<template>
  <el-card shadow="hover">
    <el-icon :size="30">
      <slot name="icon"></slot>
    </el-icon>
    <div>
      <slot>
        <span>{{ name }}</span>
      </slot>
    </div>
  </el-card>
</template>

<style scoped>

</style>

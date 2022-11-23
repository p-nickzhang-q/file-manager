<script lang="ts" setup>
import CustomComponent from "./CustomComponent";

const props = defineProps<{
  config: any,
  form: object
}>();

const emits = defineEmits(['update:form']);

const localValue = computed({
  get() {
    return props.form
  },
  set(value) {
    emits('update:form', value);
  }
});


const localElements = computed(() => {
  return props.config.fields?.map((value: any) => {
    const {__config__, ...attrs} = value;
    return {
      element: __config__.tag,
      label: __config__.label,
      span: __config__.span,
      children: __config__.children,
      attrs,
    }
  })
});

const childrenConfig = (config: any) => {
  return {
    ...config,
    gutter: props.config.gutter,
    fields: config.children
  }
}

</script>

<template>
  <el-row :gutter="config.gutter">
    <el-col :span="item.span" v-for="(item) in localElements">
      <CustomComponent v-if="!item.children?.length" element="el-form-item" :label="item.label">
        <CustomComponent
            :element="item.element" :attrs="item.attrs" v-model="localValue[item.attrs.__vModel__]"/>
      </CustomComponent>
      <CustomFormItems v-else v-model:form="localValue" :config="childrenConfig(item)"/>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>

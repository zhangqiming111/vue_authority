<template>
  <div class="formDesign">
    <div class="formDesign-panel">
      <h4>组件库</h4>
      <draggable
        class="field-list"
        :list="fieldTypes"
        :group="{ name: 'fields', pull: 'clone', put: false }"
        :clone="cloneField"
        item-key="type"
      >
        <template #item="{ element }">
          <div class="field-item">{{ element.label }}</div>
        </template>
      </draggable>
    </div>
    <div class="formDesign-canvas">
      <h4>表单画布</h4>
      <draggable class="canvas-area" v-model="formFields" group="fields" item-key="id">
        <template #item="{ element, index }">
          <div class="canvas-field">
            <label>{{ element.label }}</label>
            <el-input v-if="element.type === 'input'" :placeholder="element.placeholder" />
            <el-input v-else-if="element.type === 'textarea'" type="textarea" :placeholder="element.placeholder" />
            <el-select v-else-if="element.type === 'select'" placeholder="请选择" />
            <el-date-picker v-else-if="element.type === 'date'" type="date" placeholder="选择日期" />
            <el-button type="text" @click="removeField(index)">删除</el-button>
          </div>
        </template>
      </draggable>
      <el-empty v-if="!formFields.length" description="从左侧拖拽组件到此处" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';

const fieldTypes = [
  { type: 'input', label: '单行输入' },
  { type: 'textarea', label: '多行输入' },
  { type: 'select', label: '下拉选择' },
  { type: 'date', label: '日期选择' },
];
const formFields = ref([]);

function cloneField(field) {
  return {
    id: `${field.type}-${Date.now()}`,
    type: field.type,
    label: field.label,
    placeholder: `请输入${field.label}`,
  };
}

function removeField(index) {
  formFields.value.splice(index, 1);
}
</script>

<style src="./FormDesign.css" scoped></style>

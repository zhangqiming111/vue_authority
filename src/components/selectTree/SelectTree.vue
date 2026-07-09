<template>
  <el-select ref="selectRef" v-model="valueTitle" :clearable="clearable" @clear="clearHandle">
    <el-option :label="valueTitle" :value="valueId">
      <el-tree
        id="tree-option"
        ref="selectTreeRef"
        default-expand-all
        :data="options"
        :props="fieldNames"
        :node-key="fieldNames.value"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      />
    </el-option>
  </el-select>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  fieldNames: {
    type: Object,
    default: () => ({
      value: 'id',
      label: 'title',
      children: 'children',
    }),
  },
  options: {
    type: Array,
    default: () => [],
  },
  value: {
    type: Number,
    default: 0,
  },
  onlyKey: {
    type: Number,
    default: 0,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['getValue']);

const selectRef = ref(null);
const selectTreeRef = ref(null);
const valueId = ref('');
const valueTitle = ref('');

function fixDropdownScroll() {
  nextTick(() => {
    const scrollWrap = document.querySelectorAll(
      '.el-scrollbar .el-select-dropdown__wrap'
    )[0];
    const scrollBars = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar');
    if (scrollWrap) {
      scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;';
    }
    scrollBars.forEach((bar) => {
      bar.style.width = 0;
    });
  });
}

function syncDisplay() {
  if (!valueId.value) {
    valueTitle.value = '';
    fixDropdownScroll();
    return;
  }

  const tree = selectTreeRef.value;
  if (!tree) return;

  const node = tree.getNode(valueId.value);
  if (!node) return;

  valueTitle.value = node.data[props.fieldNames.label];
  tree.setCurrentKey(valueId.value);
  fixDropdownScroll();
}

function handleNodeClick(node) {
  valueTitle.value = node[props.fieldNames.label];
  valueId.value = node[props.fieldNames.value];
  emit('getValue', valueId.value);
  selectRef.value?.blur();
}

function clearHandle() {
  valueTitle.value = '';
  valueId.value = null;
  document.querySelectorAll('#tree-option .el-tree-node').forEach((el) => {
    el.classList.remove('is-current');
  });
  emit('getValue', null);
}

watch(
  () => props.value,
  (val) => {
    valueId.value = val;
    syncDisplay();
  }
);

onMounted(() => {
  valueId.value = props.value;
  if (props.onlyKey && selectTreeRef.value) {
    const node = selectTreeRef.value.getNode(props.onlyKey);
    if (node) node.visible = false;
  }
  syncDisplay();
});
</script>

<style scoped>
.el-select {
  width: 100%;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
:deep(.el-tree .el-tree-node__content) {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
:deep(.el-tree .is-current .el-tree-node__label) {
  color: #409eff;
  font-weight: 700;
}
:deep(.el-tree .is-current .el-tree-node__children .el-tree-node__label) {
  color: #606266;
  font-weight: normal;
}
</style>

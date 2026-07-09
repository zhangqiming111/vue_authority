<template>
  <div class="menu">
    <div class="table">
      <div class="table-header">
        <p class="p-left">
          <el-button type="default" @click="openDialog('添加路由')">添加路由</el-button>
        </p>
        <p class="p-right">
          <el-input placeholder="请输入关键字检索" class="search-input" v-model="search" clearable />
        </p>
      </div>
      <el-table :data="filteredRouterList" row-key="routerId" :tree-props="{ children: 'children' }">
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="text" @click="openDialog('编辑', scope)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-popconfirm title="这是一段内容确定删除吗?" @confirm="removeRouter(scope.row.routerId)">
              <template #reference>
                <el-button type="text" :disabled="!!scope.row.children">删除</el-button>
              </template>
            </el-popconfirm>
            <el-divider direction="vertical" />
            <el-button type="text" :disabled="!!scope.row.children" @click="openResourceDialog(scope.row)">
              资源分配
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%" :destroy-on-close="true">
      <div class="form-type" v-if="dialogTitle === '添加路由'">
        <el-radio-group v-model="formType">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">资源</el-radio>
        </el-radio-group>
      </div>

      <el-form
        v-if="formType === 1"
        ref="menuformRef"
        :rules="rules"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入路由标题" />
        </el-form-item>
        <el-form-item label="地址" prop="path">
          <el-input v-model="form.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入路由名称" />
        </el-form-item>
        <el-form-item label="层级" prop="routerId">
          <select-tree
            :field-names="defaultProps"
            :options="routerList"
            :value="form.routerId"
            :onlyKey="updateId"
            @getValue="setParentId"
          />
        </el-form-item>
      </el-form>

      <el-form
        v-else
        ref="resourceFormRef"
        :rules="resourceRules"
        :model="resourceForm"
        label-width="80px"
      >
        <el-form-item label="资源标题" prop="name">
          <el-input v-model="resourceForm.name" placeholder="请输入资源标题" />
        </el-form-item>
        <el-form-item label="资源名称" prop="type">
          <el-input v-model="resourceForm.type" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="绑定层级" prop="routerId">
          <select-tree
            :field-names="defaultProps"
            :options="routerList"
            :value="resourceForm.routerId"
            :onlyKey="updateId"
            @getValue="setResourceParentId"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { routerApi } from '@/api/router';
import { resourceApi } from '@/api/resource';
import { useRouterStore } from '@/stores/router';
import { notifySuccess } from '@/utils/message';
import { filterTreeByKeyword } from '@/utils/search';
import SelectTree from '@/components/selectTree/SelectTree.vue';

const routerStore = useRouterStore();
const { routerList } = storeToRefs(routerStore);

const filteredRouterList = computed(() =>
  filterTreeByKeyword(routerList.value, search.value)
);

const formType = ref(1);
const defaultProps = { value: 'routerId', label: 'title', children: 'children' };
const tableColumn = [
  { label: '标题', prop: 'title' },
  { label: '地址', prop: 'path' },
  { label: '名称', prop: 'name' },
];
const form = ref({ title: '', path: '', name: '', routerId: 0 });
const resourceForm = ref({ name: '', type: '', routerId: 0 });
const rules = {
  title: [{ required: true, message: '请输入路由标题', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
  name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
};
const resourceRules = {
  name: [{ required: true, message: '请输入资源标题', trigger: 'blur' }],
  type: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
};

const search = ref('');
const dialogVisible = ref(false);
const dialogTitle = ref('');
const updateId = ref('');
const menuformRef = ref(null);
const resourceFormRef = ref(null);

async function removeRouter(routerId) {
  const res = await routerApi.remove(routerId);
  if (res.code === 0) {
    notifySuccess(res.msg);
    routerStore.fetchRouters();
  }
}

async function submitForm() {
  if (formType.value === 1) {
    await menuformRef.value.validate();
    const payload = {
      title: form.value.title,
      name: form.value.name,
      path: form.value.path,
      parentId: form.value.routerId,
    };
    const isCreate = dialogTitle.value === '添加路由';
    const res = isCreate
      ? await routerApi.add(payload)
      : await routerApi.update({ ...payload, routerId: updateId.value });

    if (res.code === 0) {
      notifySuccess(res.msg);
      closeDialog();
      routerStore.fetchRouters();
    }
    return;
  }

  await resourceFormRef.value.validate();
  const res = await resourceApi.add({
    name: resourceForm.value.name,
    type: resourceForm.value.type,
    routerId: resourceForm.value.routerId,
  });
  if (res.code === 0) {
    notifySuccess(res.msg);
    closeDialog();
    routerStore.fetchRouters();
  }
}

function setParentId(value) {
  form.value.routerId = value ?? 0;
}

function setResourceParentId(value) {
  resourceForm.value.routerId = value ?? 0;
}

function openDialog(title, scope) {
  dialogVisible.value = true;
  dialogTitle.value = title;
  formType.value = title === '添加路由' ? formType.value : 1;

  if (!scope) {
    resetForm();
    return;
  }

  const { row } = scope;
  updateId.value = row.routerId;
  form.value = {
    title: row.title,
    name: row.name,
    path: row.path,
    routerId: row.parentId || 0,
  };
}

function openResourceDialog(row) {
  dialogVisible.value = true;
  dialogTitle.value = '添加资源';
  formType.value = 2;
  updateId.value = row.routerId;
  resourceForm.value = { name: '', type: '', routerId: row.routerId };
}

function resetForm() {
  updateId.value = '';
  form.value = { title: '', path: '', name: '', routerId: 0 };
  resourceForm.value = { name: '', type: '', routerId: 0 };
}

function closeDialog() {
  dialogVisible.value = false;
  dialogTitle.value = '';
  resetForm();
}

onMounted(() => routerStore.fetchRouters());
</script>

<style src="./Menu.css" scoped></style>

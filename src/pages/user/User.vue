<template>
  <div class="user">
    <div class="table">
      <div class="table-header">
        <p class="p-left">
          <el-button type="default" @click="openDialog('添加用户')">添加用户</el-button>
        </p>
        <p class="p-right">
          <el-input placeholder="请输入关键字检索" class="search-input" v-model="search" clearable />
        </p>
      </div>
      <el-table :data="filteredData">
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center"
        >
          <template #default="scope" v-if="item.prop === 'active'">
            <el-switch
              v-model="scope.row.active"
              @change="toggleActive(scope.row)"
              :disabled="scope.row.userType === 'admin'"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="text" @click="openDialog('编辑用户', scope)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-popconfirm title="这是一段内容确定删除吗?" @confirm="removeUser(scope.row.userId)">
              <template #reference>
                <el-button type="text" :disabled="scope.row.userType === 'admin'">删除</el-button>
              </template>
            </el-popconfirm>
            <el-divider direction="vertical" />
            <el-popconfirm title="是否确定进行密码重置?" @confirm="resetPassword(scope.row.userId)">
              <template #reference>
                <el-button type="text">重置密码</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
      <el-form ref="userformRef" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker style="width: 100%" type="date" placeholder="选择日期" v-model="form.createTime" />
        </el-form-item>
        <el-form-item label="用户" prop="name">
          <el-input v-model="form.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogTitle === '添加用户'">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="角色类型:" v-if="userType !== 'admin'">
          <el-checkbox-group v-model="form.checkedList">
            <el-checkbox v-for="item in roleList" :key="item.roleId" :label="item.roleId">
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
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
import { userApi } from '@/api/user';
import { useRoleStore } from '@/stores/role';
import { formatDate } from '@/utils/format';
import { filterByKeyword } from '@/utils/search';
import { notifySuccess } from '@/utils/message';

const roleStore = useRoleStore();
const { roleList } = storeToRefs(roleStore);

const tableColumn = [
  { label: '创建日期', prop: 'createTime' },
  { label: '用户', prop: 'name' },
  { label: '账号', prop: 'account' },
  { label: '是否启用', prop: 'active' },
];

const form = ref({ createTime: '', name: '', account: '', password: '', checkedList: [] });
const rules = {
  createTime: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
  name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const tableData = ref([]);
const search = ref('');
const filteredData = computed(() => filterByKeyword(tableData.value, search.value));
const dialogVisible = ref(false);
const dialogTitle = ref('');
const updateId = ref('');
const userType = ref('');
const active = ref(0);
const userformRef = ref(null);

async function fetchUsers() {
  const res = await userApi.query();
  if (res.code !== 0) return;
  tableData.value = res.data.map((item) => ({
    ...item,
    createTime: formatDate(item.createTime),
    active: Boolean(item.active),
  }));
}

async function toggleActive(row) {
  const res = await userApi.setActive({ active: row.active ? 1 : 0, userId: row.userId });
  if (res.code === 0) {
    notifySuccess(res.msg);
    fetchUsers();
  }
}

async function removeUser(userId) {
  const res = await userApi.remove(userId);
  if (res.code === 0) {
    notifySuccess(res.msg);
    fetchUsers();
  }
}

async function resetPassword(userId) {
  const res = await userApi.resetPassword(userId);
  if (res.code === 0) notifySuccess(res.msg);
}

async function submitForm() {
  await userformRef.value.validate();
  const payload = {
    createTime: formatDate(form.value.createTime),
    name: form.value.name,
    account: form.value.account,
    password: form.value.password,
    roleIds: form.value.checkedList,
  };

  const isCreate = dialogTitle.value === '添加用户';
  const res = isCreate
    ? await userApi.add({ ...payload, active: 0 })
    : await userApi.update({ ...payload, userId: updateId.value, active: active.value });

  if (res.code === 0) {
    notifySuccess(res.msg);
    closeDialog();
    fetchUsers();
  }
}

function resetForm() {
  updateId.value = '';
  userType.value = '';
  active.value = 0;
  form.value = { createTime: '', name: '', account: '', password: '', checkedList: [] };
}

function openDialog(title, scope) {
  dialogVisible.value = true;
  dialogTitle.value = title;
  roleStore.fetchRoles();
  if (!scope) {
    resetForm();
    return;
  }
  const { row } = scope;
  active.value = Number(row.active);
  userType.value = row.userType;
  updateId.value = row.userId;
  form.value = {
    createTime: row.createTime,
    name: row.name,
    account: row.account,
    password: row.password,
    checkedList: row.roleIds || [],
  };
}

function closeDialog() {
  dialogVisible.value = false;
  dialogTitle.value = '';
  resetForm();
}

onMounted(fetchUsers);
</script>

<style src="./User.css" scoped></style>

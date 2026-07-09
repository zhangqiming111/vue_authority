<template>
  <div class="role">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="table">
          <div class="table-header">
            <p class="p-left">
              <el-button type="default" @click="openDialog('添加角色')">添加角色</el-button>
            </p>
          </div>
          <el-table :data="roleList" @row-click="loadRoleRouters" :row-class-name="tableRowClassName">
            <el-table-column label="角色" prop="roleName" align="center" />
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button type="text" @click.stop="openDialog('编辑', scope)">编辑</el-button>
                <el-divider direction="vertical" />
                <el-popconfirm title="这是一段内容确定删除吗?" @confirm="removeRole(scope.row.roleId)">
                  <template #reference>
                    <el-button type="text" @click.stop>删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="pannel">
          <div class="pannel-header">
            <p class="p-left">
              <el-button type="primary" @click="bindMenus">绑定菜单</el-button>
            </p>
          </div>
          <div class="pannel-tree">
            <el-tree
              ref="treeRef"
              :data="routerList"
              show-checkbox
              default-expand-all
              node-key="routerId"
              :props="defaultProps"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
      <el-form ref="roleformRef" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
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
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { roleApi } from '@/api/role';
import { useRoleStore } from '@/stores/role';
import { useRouterStore } from '@/stores/router';
import { collectCheckedTreeIds } from '@/utils/tree';
import { notifySuccess } from '@/utils/message';

const roleStore = useRoleStore();
const routerStore = useRouterStore();
const { roleList } = storeToRefs(roleStore);
const { routerList } = storeToRefs(routerStore);

const form = ref({ roleName: '' });
const rules = { roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }] };
const dialogVisible = ref(false);
const dialogTitle = ref('');
const selectedRoleId = ref('');
const defaultProps = { children: 'children', label: 'title' };
const treeRef = ref(null);
const roleformRef = ref(null);

async function initPage() {
  await Promise.all([roleStore.fetchRoles(), routerStore.fetchRouters()]);
  const firstRoleId = roleList.value[0]?.roleId;
  if (firstRoleId) loadRoleRouters({ roleId: firstRoleId });
}

async function removeRole(roleId) {
  const res = await roleApi.remove(roleId);
  if (res.code === 0) {
    treeRef.value?.setCheckedKeys([]);
    notifySuccess(res.msg);
    roleStore.fetchRoles();
  }
}

async function submitForm() {
  await roleformRef.value.validate();
  const isCreate = dialogTitle.value === '添加角色';
  const res = isCreate
    ? await roleApi.add({ roleName: form.value.roleName })
    : await roleApi.update({ roleId: selectedRoleId.value, roleName: form.value.roleName });

  if (res.code === 0) {
    notifySuccess(res.msg);
    closeDialog();
    roleStore.fetchRoles();
  }
}

async function loadRoleRouters(row) {
  selectedRoleId.value = row.roleId;
  treeRef.value?.setCheckedKeys([]);

  const res = await roleApi.getRoleRouters(row.roleId);
  if (res.code !== 0) return;

  res.data.routerIds.forEach((id) => {
    const node = treeRef.value.getNode(id);
    if (node?.isLeaf) treeRef.value.setChecked(node, true);
  });
}

async function bindMenus() {
  const routerIds = collectCheckedTreeIds(treeRef.value);
  const res = await roleApi.bindRouter({ roleId: selectedRoleId.value, routerIds });
  if (res.code === 0) notifySuccess(res.msg);
}

function tableRowClassName({ row }) {
  return row.roleId === selectedRoleId.value ? 'select-row' : '';
}

function openDialog(title, scope) {
  dialogVisible.value = true;
  dialogTitle.value = title;
  selectedRoleId.value = scope?.row.roleId || '';
  form.value.roleName = scope?.row.roleName || '';
}

function closeDialog() {
  dialogVisible.value = false;
  dialogTitle.value = '';
  form.value.roleName = '';
}

onMounted(initPage);
</script>

<style src="./Role.css" scoped></style>
<style>
.el-table .select-row { background: #F5F7FA; }
</style>

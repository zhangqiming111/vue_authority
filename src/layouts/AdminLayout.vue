<template>
  <div class="admin">
    <el-container>
      <el-aside width="auto">
        <div class="aside_header">
          <p class="aside_content">
            <span class="aside_title" v-if="isTitle">配置管理平台</span>
            <span class="iconfont icon-setting-fill" v-else></span>
          </p>
        </div>
        <el-menu
          mode="vertical"
          class="el-menu-vertical-demo"
          :collapse="collapse"
          :default-openeds="[parentOpenActive]"
          :default-active="routeActive"
        >
          <template v-for="(item, index) in menuList" :key="index">
            <el-sub-menu v-if="item.routes" :index="item.path">
              <template #title>
                <i :class="`iconfont ${item.icon} iconInterval`"></i>
                <span>{{ item.title }}</span>
              </template>
              <router-link v-for="(subItem, subIndex) in item.routes" :to="subItem.path" :key="subIndex">
                <el-menu-item :index="subItem.path">
                  <template #title><span>{{ subItem.title }}</span></template>
                </el-menu-item>
              </router-link>
            </el-sub-menu>
            <router-link v-else :to="item.path">
              <el-menu-item :index="item.path">
                <i :class="`iconfont ${item.icon} iconInterval`"></i>
                <template #title><span>{{ item.title }}</span></template>
              </el-menu-item>
            </router-link>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-left">
            <i :class="`iconfont ${collapseIcon} iconInterval`" @click="toggleCollapse"></i>
            <el-tooltip effect="light" content="刷新" placement="bottom">
              <i class="iconfont icon-shuaxin iconInterval" @click="reloadPage"></i>
            </el-tooltip>
            <el-tooltip effect="light" content="全屏" placement="bottom">
              <i class="iconfont icon-quanping iconInterval" @click="toggleFullscreen"></i>
            </el-tooltip>
          </div>
          <div>
            <el-tooltip effect="light" content="消息通知" placement="bottom">
              <i class="iconfont icon-xiaoxitongzhi iconInterval" @click="drawer = true"></i>
            </el-tooltip>
            <el-tooltip effect="light" content="注销" placement="bottom">
              <i class="iconfont icon-user" @click="handleLogout"></i>
            </el-tooltip>
          </div>
        </el-header>
        <el-main>
          <el-breadcrumb>
            <el-breadcrumb-item>配置管理平台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentBreadcrumb }}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view />
        </el-main>
      </el-container>
      <el-drawer v-model="drawer" title="通知栏" direction="rtl">
        <el-empty description="暂无消息" />
      </el-drawer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  loadAuthorizedMenus,
  resolveDefaultRoute,
  isRouteAuthorized,
  resolveParentMenuPath,
} from '@/composables/useMenuAuth';
import { logout } from '@/router/guards';

const route = useRoute();
const router = useRouter();

const menuList = ref([]);
const collapse = ref(false);
const collapseIcon = ref('icon-cc-arrow-left-square');
const routeActive = ref('');
const parentOpenActive = ref('');
const isTitle = ref(true);
const currentBreadcrumb = ref('');
const drawer = ref(false);

watch(
  () => route.meta,
  (meta) => {
    currentBreadcrumb.value = meta.breadcrumb || meta.breamub || '';
  },
  { immediate: true, deep: true }
);

async function initMenus() {
  const { authorized, menuList: menus, routes } = await loadAuthorizedMenus();
  if (!authorized) return;

  if (!isRouteAuthorized(route.name, routes, route.path)) {
    router.push('/error');
    return;
  }

  menuList.value = menus;
  parentOpenActive.value = resolveParentMenuPath(route.matched, route.path);
  routeActive.value = route.path === '/'
    ? resolveDefaultRoute(routes, route.path)
    : route.path;
}

function toggleCollapse() {
  collapse.value = !collapse.value;
  collapseIcon.value = collapse.value
    ? 'icon-cc-arrow-right-square'
    : 'icon-cc-arrow-left-square';
  setTimeout(() => { isTitle.value = !isTitle.value; }, 100);
}

function reloadPage() {
  window.location.reload();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

function handleLogout() {
  logout(router);
}

onMounted(initMenus);
</script>

<style src="@/layouts/AdminLayout.css" scoped></style>

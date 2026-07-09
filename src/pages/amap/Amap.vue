<template>
  <div class="amap">
    <div id="container">
      <div class="keywordClass">
        <el-input placeholder="关键字检索" id="keywordInput" v-model="keywordInput">
          <template #append>
            <el-button @click="keywordSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div id="panel" class="panelClass"></div>
    </div>
    <div class="routePlan">
      <div class="routeSearchClass">
        <div class="locationSearch">
          <el-input placeholder="起始位置" v-model="locationSearchStart" />
          <el-input placeholder="结束位置" v-model="locationSearchEnd" />
          <el-button type="primary" @click="routeSearch">搜索</el-button>
        </div>
        <div class="covertSearchType">
          <ul>
            <li v-for="item in routeTypes" :key="item.value">
              <div><span>{{ item.label }}</span></div>
              <div>
                <el-radio :label="item.value" v-model="radioChecked" @change="checkBindVal">
                  <span />
                </el-radio>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div id="routePanel" class="routePanelClass"></div>
    </div>
  </div>
</template>

<script setup>
import { ROUTE_TYPES } from '@/constants/amap';
import { useAmap } from '@/composables/useAmap';

const routeTypes = ROUTE_TYPES;

const {
  keywordInput,
  locationSearchStart,
  locationSearchEnd,
  radioChecked,
  keywordSearch,
  routeSearch,
  checkBindVal,
} = useAmap();
</script>

<style src="./Amap.css"></style>

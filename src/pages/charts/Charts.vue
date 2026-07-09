<template>
  <div class="charts">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基础示例" name="first">
        <div class="chartsTop">
          <div class="chartCard" id="line"></div>
          <div class="chartCard" id="bar"></div>
          <div class="chartCard" id="pie"></div>
        </div>
        <div class="chartsTop">
          <div class="chartCard" id="scatter"></div>
          <div class="chartCard" id="area"></div>
          <div class="chartCard" id="candlestick"></div>
        </div>
        <div class="chartsTop">
          <div class="chartCard" id="radar"></div>
          <div class="chartCard" id="graph"></div>
          <div class="chartCard" id="treemap"></div>
        </div>
        <div class="chartsTop">
          <div class="chartCard" id="gauge"></div>
          <div class="chartCard" id="funnel"></div>
          <div class="chartCard" id="sunburst"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="复杂图例" name="second" />
      <el-tab-pane label="图表设计" name="third" />
      <el-tab-pane label="大屏案例" name="fourth" />
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { initBasicCharts, disposeBasicCharts } from '@/composables/useCharts';

const activeName = ref('first');

onMounted(initBasicCharts);
onBeforeUnmount(disposeBasicCharts);
</script>

<style src="./Charts.css" scoped></style>

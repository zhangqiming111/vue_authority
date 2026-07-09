<template>
  <div class="flowDesign">
    <div class="flowDesign-flex">
      <div class="flowDesign-flex_left">
        <ul class="list-group">
          <li
            class="list-group-node"
            v-for="(item, index) in nodeList"
            :key="index"
            :style="{ width: item.size[0] + 'px', height: item.size[1] + 'px' }"
            draggable="true"
            @dragstart="onDragStart"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
      <div class="flowDesign-flex_middle">
        <div id="relation-box"></div>
      </div>
      <div class="flowDesign-flex_right"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Graph, Grid } from '@antv/g6';

const shapes = ['circle', 'rect', 'ellipse', 'diamond', 'triangle'];
const nodeList = computed(() =>
  shapes.map((shape, index) => ({
    size: [58, 30],
    shape,
    label: `节点${index + 1}`,
  }))
);

function onDragStart(event) {
  event.preventDefault();
}

onMounted(() => {
  const container = document.querySelector('#relation-box');
  if (!container) return;

  const graph = new Graph({
    container: 'relation-box',
    width: container.offsetWidth,
    height: container.offsetHeight,
    plugins: [new Grid()],
  });

  graph.data({
    nodes: nodeList.value.map((node) => ({
      size: node.size,
      shape: node.shape,
      label: node.label,
    })),
  });
  graph.render();
});
</script>

<style src="./FlowDesign.css" scoped></style>

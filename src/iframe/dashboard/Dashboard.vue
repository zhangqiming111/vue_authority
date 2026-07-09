<template>
  <div class="iframe-container">
    <iframe ref="iframeRef" :src="IFRAME_DASHBOARD_URL" id="iframeId" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { IFRAME_DASHBOARD_URL, postIframeAuth } from '@/composables/useIframeBridge';

const iframeRef = ref(null);

function handleLoad() {
  postIframeAuth(iframeRef.value);
}

onMounted(() => {
  iframeRef.value?.addEventListener('load', handleLoad);
  handleLoad();
});

onBeforeUnmount(() => {
  iframeRef.value?.removeEventListener('load', handleLoad);
});
</script>

<style scoped>
.iframe-container {
  margin: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 74px);
}

.iframe-container > iframe {
  border: none;
  width: 100%;
  height: 100%;
}
</style>

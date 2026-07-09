<template>
  <div class="webSocket">
    <div class="webSocket-toolbar">
      <el-button type="primary" @click="connect" :disabled="connected">连接</el-button>
      <el-button @click="disconnect" :disabled="!connected">断开</el-button>
    </div>
    <div class="webSocket-send">
      <el-input v-model="message" placeholder="输入消息" @keyup.enter="sendMessage" />
      <el-button type="primary" @click="sendMessage" :disabled="!connected">发送</el-button>
    </div>
    <div class="webSocket-logs">
      <p v-for="(log, index) in logs" :key="index">{{ log }}</p>
      <el-empty v-if="!logs.length" description="暂无通信记录" />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

const socket = ref(null);
const connected = ref(false);
const message = ref('');
const logs = ref([]);

function appendLog(text) {
  logs.value.unshift(`${new Date().toLocaleTimeString()} ${text}`);
}

function connect() {
  if (connected.value) return;
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const url = `${protocol}://${window.location.hostname}:8088/ws`;

  socket.value = new WebSocket(url);
  socket.value.onopen = () => {
    connected.value = true;
    appendLog('连接成功');
  };
  socket.value.onmessage = (event) => appendLog(`收到: ${event.data}`);
  socket.value.onerror = () => appendLog('连接异常，请确认后端 WebSocket 服务已启动');
  socket.value.onclose = () => {
    connected.value = false;
    appendLog('连接已关闭');
  };
}

function disconnect() {
  socket.value?.close();
  socket.value = null;
  connected.value = false;
}

function sendMessage() {
  if (!connected.value || !message.value.trim()) return;
  socket.value.send(message.value);
  appendLog(`发送: ${message.value}`);
  message.value = '';
}

onBeforeUnmount(disconnect);
</script>

<style src="./WebSocket.css" scoped></style>

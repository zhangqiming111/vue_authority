<template>
  <div class="openai">
    <div class="openai-issue">
      <textarea v-model="issue" placeholder="请输入问题" />
    </div>
    <div class="openai-submit">
      <el-button type="primary" :loading="loading" @click="submitQuestion">提交</el-button>
    </div>
    <div class="openai-answer">{{ answer }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { openaiApi } from '@/api/openai';

const issue = ref('');
const answer = ref('');
const loading = ref(false);

async function submitQuestion() {
  if (!issue.value.trim()) return;
  loading.value = true;
  try {
    const res = await openaiApi.answer(issue.value);
    if (res.code === 0) answer.value = res.data[0]?.text || '';
  } finally {
    loading.value = false;
  }
}
</script>

<style src="./Openai.css"></style>

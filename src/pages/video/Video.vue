<template>
  <div class="video-layout">
    <div class="video-upload">
      <el-form>
        <el-form-item label="视频地址"><el-input placeholder="需要上传的视频链接" /></el-form-item>
        <el-form-item label="视频类型">
          <el-select placeholder="选择视频类型"><el-option value="卡通类">卡通类</el-option></el-select>
        </el-form-item>
        <el-form-item label="视频名称"><el-input placeholder="自定义视频名称" /></el-form-item>
        <el-form-item><el-button type="primary">上传</el-button></el-form-item>
      </el-form>
    </div>
    <div class="video">
      <div class="video-left">
        <video :src="videoUrl" autoplay controls loop />
      </div>
      <div class="video-right">
        <el-tabs v-model="activeVideo" class="demo-tabs" type="card" editable>
          <el-tab-pane label="卡通类" name="comic">
            <ul>
              <li v-for="(item, index) in videoList" :key="index">
                <div><span>{{ item.title }}</span></div>
                <div>
                  <input type="radio" :value="item.url" :checked="item.checked" @change="selectVideo(index)" />
                  <el-divider direction="vertical" />
                  <el-button type="text">删除</el-button>
                </div>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { videoApi } from '@/api/video';

const videoList = ref([]);
const videoUrl = ref('');
const activeVideo = ref('comic');

function selectVideo(index) {
  videoList.value.forEach((item, i) => { item.checked = i === index; });
  videoUrl.value = videoList.value[index]?.url || '';
}

async function fetchVideos() {
  const res = await videoApi.query();
  if (res.code !== 0 || !res.data.length) return;
  videoList.value = res.data.map((item, index) => ({ ...item, checked: index === 0 }));
  videoUrl.value = res.data[0].url;
}

onMounted(fetchVideos);
</script>

<style src="./Video.css" scoped></style>

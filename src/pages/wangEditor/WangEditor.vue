<template>
  <div class="wangEditor">
    <div class="toolbar">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
    </div>
    <p class="glp"></p>
    <div class="mainContainer">
      <div class="contentUl"></div>
      <div class="text">
        <Editor
          style="height: 500px; overflow-y: hidden;"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
        />
        <div class="text-action"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const editor = shallowRef(null);
const html = ref('<p>hello</p>');
const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };
const mode = 'default';

function onCreated(ed) {
  editor.value = ed;
}

onMounted(() => {
  setTimeout(() => {
    html.value = '<p>模拟 Ajax 异步设置内容 HTML</p>';
  }, 1500);
});
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style src="./WangEditor.css" scoped></style>

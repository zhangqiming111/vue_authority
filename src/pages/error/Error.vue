<template>
  <div class="error">
    <div class="error-title">404</div>
    <div class="error-remark">可能我们真的走错了</div>
    <div class="error-btns">
      <el-button type="default" @click="$router.push('/')">点击返回</el-button>
    </div>
  </div>
</template>

<script>
export default { name: 'Error' };
</script>

<style src="./Error.css" scoped></style>

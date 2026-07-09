<template>
  <div class="login">
    <div class="login_main">
      <div class="main_left"><img src="../../assets/login.png" alt="login" /></div>
      <div class="main_right">
        <el-container>
          <el-header><span>配置管理平台</span></el-header>
          <el-main>
            <div class="login_operate">
              <el-input class="login_input" placeholder="账号" v-model="account" clearable />
              <el-input class="login_input" placeholder="密码" type="password" v-model="password" clearable />
              <div class="sub_content_right">
                <el-button type="text">立即注册</el-button>
                <el-divider direction="vertical" />
                <el-button type="text">忘记密码?</el-button>
              </div>
              <el-button type="primary" round style="width: 100%; margin: 0;" @click="handleLogin">
                登录
              </el-button>
            </div>
          </el-main>
          <el-footer><span>版权控制所有@copyright</span></el-footer>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userApi } from '@/api/user';
import { setAuthSession } from '@/composables/useAuth';
import { notifyError } from '@/utils/message';

const router = useRouter();
const account = ref('');
const password = ref('');

async function handleLogin() {
  if (!account.value || !password.value) {
    notifyError('请输入账号和密码');
    return;
  }

  const res = await userApi.login({ account: account.value, password: password.value });
  if (!res || res.code !== 0) {
    notifyError(res?.msg || '登录失败');
    return;
  }

  const users = res.data?.result;
  if (!users?.length) {
    notifyError('登录返回数据异常');
    return;
  }

  const user = users[0];
  setAuthSession({ token: res.data.token, userId: user.userId, userType: user.userType });
  router.push('/');
}
</script>

<style src="./Login.css" scoped></style>
<style>
.login_input > .el-input__inner {
  border: none;
  border-bottom: 1px solid #e9e9e9;
  border-radius: 0;
}
.sub_content_right { text-align: right; }
.sub_content_right > .el-button { margin: 0; }
.login_operate > .el-button { margin: 10px 0; }
</style>

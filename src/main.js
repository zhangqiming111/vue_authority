import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import locale from 'element-plus/es/locale/lang/zh-cn';
import fundebug from 'fundebug-javascript';
import FundebugVue from 'fundebug-vue';
import permissionDirective from '@/directives/permission';

const app = createApp(App);
const pinia = createPinia();

fundebug.apikey = '42a20705e4545857870565c0d907e74fd6a10258b6498420d2e7d92c6dab00ed';

app.use(pinia);
app.use(ElementPlus, { locale });
app.use(router);
app.use(permissionDirective);
app.use(new FundebugVue(fundebug));

app.mount('#app');

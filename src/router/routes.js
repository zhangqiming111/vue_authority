import iframeRouter from '@/iframe/configRouter';

/** 需登录后访问的业务路由 */
export const menuRouter = {
  path: '/',
  name: 'admin',
  component: () => import('@/layouts/AdminLayout.vue'),
  children: [
    ...iframeRouter,
    {
      path: '/map',
      name: 'map',
      icon: 'icon-location',
      title: '地图引擎',
      meta: { breadcrumb: '地图引擎' },
      component: () => import('@/pages/amap/Amap.vue'),
    },
    {
      path: '/charts',
      name: 'charts',
      icon: 'icon-odometer',
      title: '图表引用',
      meta: { breadcrumb: '图表引用' },
      component: () => import('@/pages/charts/Charts.vue'),
    },
    {
      path: '/video',
      name: 'video',
      icon: 'icon-camera',
      title: '视频管理',
      meta: { breadcrumb: '视频管理' },
      component: () => import('@/pages/video/Video.vue'),
    },
    {
      path: '/wangEditor',
      name: 'wangEditor',
      icon: 'icon-edit-square',
      title: '文本编辑',
      meta: { breadcrumb: '文本编辑' },
      component: () => import('@/pages/wangEditor/WangEditor.vue'),
    },
    {
      path: '/webSocket',
      name: 'webSocket',
      icon: 'icon-monitor',
      title: '即时通信',
      meta: { breadcrumb: '即时通信' },
      component: () => import('@/pages/webSocket/WebSocket.vue'),
    },
    {
      path: '/authority',
      name: 'authority',
      icon: 'icon-shenqingquanxian',
      title: '权限管理',
      component: () => import('@/router/RouterViewLayout.vue'),
      children: [
        {
          path: '/user',
          name: 'user',
          title: '用户管理',
          meta: { breadcrumb: '用户管理' },
          component: () => import('@/pages/user/User.vue'),
        },
        {
          path: '/role',
          name: 'role',
          title: '角色管理',
          meta: { breadcrumb: '角色管理' },
          component: () => import('@/pages/role/Role.vue'),
        },
        {
          path: '/menu',
          name: 'menu',
          title: '菜单管理',
          meta: { breadcrumb: '菜单管理' },
          component: () => import('@/pages/menu/Menu.vue'),
        },
      ],
    },
    {
      path: '/dragTool',
      name: 'dragTool',
      icon: 'icon-keshihua',
      title: '拖拽工具',
      component: () => import('@/router/RouterViewLayout.vue'),
      children: [
        {
          path: '/flowDesign',
          name: 'flowDesign',
          title: '流程设计',
          meta: { breadcrumb: '流程设计' },
          component: () => import('@/pages/flowDesign/FlowDesign.vue'),
        },
        {
          path: '/formDesign',
          name: 'formDesign',
          title: '表单设计',
          meta: { breadcrumb: '表单设计' },
          component: () => import('@/pages/formDesign/FormDesign.vue'),
        },
      ],
    },
    {
      path: '/businessScene',
      name: 'businessScene',
      icon: 'icon-grid',
      title: '业务场景',
      component: () => import('@/router/RouterViewLayout.vue'),
      children: [
        {
          path: '/market',
          name: 'market',
          title: '营销活动',
          meta: { breadcrumb: '营销活动' },
          component: () => import('@/pages/market/Market.vue'),
        },
        {
          path: '/openai',
          name: 'openai',
          title: '智能对话',
          meta: { breadcrumb: '智能对话' },
          component: () => import('@/pages/openai/Openai.vue'),
        },
      ],
    },
  ],
};

/** 无需权限校验的公开路由 */
export const publicRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/Login.vue'),
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/pages/error/Error.vue'),
  },
  {
    path: '/qrcode',
    name: 'qrcode',
    component: () => import('@/pages/weixin/Qrcode.vue'),
  },
];

export const routes = [...publicRoutes, menuRouter];

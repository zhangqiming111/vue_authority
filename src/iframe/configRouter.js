// iframe嵌入的路由项
export default [
  {
    path: "/dashboard",
    name: "dashboard",
    icon: "icon-grid",
    title: "首页",
    meta: { breadcrumb: '首页' },
    component: () => import("./dashboard/Dashboard.vue"),
  },
];

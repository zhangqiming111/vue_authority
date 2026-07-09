import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { setupRouterGuards } from './guards';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupRouterGuards(router);

export { routes, menuRouter } from './routes';
export default router;

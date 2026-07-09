import { PUBLIC_PATHS } from '@/constants/storage';
import { getToken, clearAuthSession } from '@/composables/useAuth';

export function setupRouterGuards(router) {
  router.beforeEach((to, from, next) => {
    const token = getToken();
    const isPublic = PUBLIC_PATHS.includes(to.path);

    if (isPublic) {
      if (to.path === '/login' && token) {
        next('/');
        return;
      }
      next();
      return;
    }

    if (!token) {
      next('/login');
      return;
    }

    next();
  });

  router.onError((error) => {
    console.error('[router]', error);
  });
}

export function logout(router) {
  clearAuthSession();
  router.push('/login');
}

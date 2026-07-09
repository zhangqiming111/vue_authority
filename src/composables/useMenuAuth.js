import { routerApi } from '@/api/router';
import { filterMenuByRoutes } from '@/utils/tree';
import { STORAGE_KEYS } from '@/constants/storage';
import { menuRouter } from '@/router/routes';

export async function loadAuthorizedMenus() {
  const userId = localStorage.getItem(STORAGE_KEYS.LOGIN_ID);
  const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
  const res = await routerApi.getUserRouters({ userId, userType });

  if (res.code !== 0) {
    return { authorized: false, menuList: [], routes: [] };
  }

  const menuList = filterMenuByRoutes(menuRouter.children, res.data);
  return { authorized: true, menuList, routes: res.data };
}

export function resolveDefaultRoute(routes, currentPath) {
  if (currentPath !== '/' || !routes.length) {
    return currentPath;
  }

  if (routes.length === 1) {
    return routes[0].path;
  }

  return routes[1].parentId !== 0 ? routes[1].path : routes[0].path;
}

export function isRouteAuthorized(routeName, routes, currentPath) {
  return routes.some((item) => item.name === routeName) || currentPath === '/';
}

export function resolveParentMenuPath(matchedRoutes, currentPath) {
  const parent = matchedRoutes.find((item, index) => (
    currentPath === item.path && index !== 0
  ));
  if (!parent) return null;
  const parentIndex = matchedRoutes.indexOf(parent);
  return matchedRoutes[parentIndex - 1]?.path ?? null;
}

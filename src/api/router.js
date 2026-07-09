import { request } from '@/utils/request';

export const routerApi = {
  query: () => request('GET', '/rest/router/query'),
  add: (data) => request('POST', '/rest/router/add', data),
  update: (data) => request('POST', '/rest/router/update', data),
  remove: (routerId) => request('POST', '/rest/router/delete', { routerId }),
  getUserRouters: (data) => request('POST', '/rest/router/getRouters', data),
};

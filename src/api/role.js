import { request } from '@/utils/request';

export const roleApi = {
  query: () => request('GET', '/rest/role/query'),
  add: (data) => request('POST', '/rest/role/add', data),
  update: (data) => request('POST', '/rest/role/update', data),
  remove: (roleId) => request('POST', '/rest/role/delete', { roleId }),
  getRoleRouters: (roleId) => request('POST', '/rest/role/getRoleRouters', { roleId }),
  bindRouter: (data) => request('POST', '/rest/role/bindRouter', data),
};

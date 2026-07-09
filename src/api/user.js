import { request } from '@/utils/request';

export const userApi = {
  login: (data) => request('POST', '/rest/user/login', data),
  query: () => request('GET', '/rest/user/query'),
  add: (data) => request('POST', '/rest/user/add', data),
  update: (data) => request('POST', '/rest/user/update', data),
  remove: (userId) => request('POST', '/rest/user/delete', { userId }),
  resetPassword: (userId) => request('POST', '/rest/user/resetPassword', { userId }),
  setActive: (data) => request('POST', '/rest/user/isActive', data),
};

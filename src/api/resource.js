import { request } from '@/utils/request';

export const resourceApi = {
  add: (data) => request('POST', '/rest/resource/add', data),
  update: (data) => request('POST', '/rest/resource/update', data),
  remove: (resourceId) => request('POST', '/rest/resource/delete', { resourceId }),
};

import { request } from '@/utils/request';

export const videoApi = {
  query: () => request('GET', '/rest/video/query'),
};

import { request } from '@/utils/request';

export const openaiApi = {
  answer: (issue) => request('POST', '/rest/openai/answer', { issue }),
};

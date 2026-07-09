import axios from 'axios';
import { STORAGE_KEYS } from '@/constants/storage';

const http = axios.create({
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  config.headers['tenant-id'] = 1;
  const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    if (response.data?.code === 401) {
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

/** 将 axios / 代理错误转为可读提示 */
export function getRequestErrorMessage(err) {
  if (!err) return '请求失败，请稍后重试';

  const status = err.response?.status;
  if (status === 500 && !err.response?.data) {
    return '无法连接后端 API（默认 http://localhost:8088），请确认后端服务已启动';
  }
  if (status === 502 || status === 503 || status === 504) {
    return '后端服务不可用，请稍后重试';
  }
  if (err.code === 'ECONNABORTED') {
    return '请求超时，请检查网络或后端服务';
  }
  if (!err.response) {
    return '网络异常，请确认前端代理与后端服务正常';
  }

  const data = err.response?.data;
  if (typeof data === 'string' && data) return data;
  if (data?.msg) return data.msg;

  return err.message || '请求失败，请稍后重试';
}

/**
 * @param {string} method
 * @param {string} url
 * @param {Object} [data]
 * @param {string} [baseURL='/api']
 * @returns {Promise<{ code: number, msg?: string, data?: unknown }>}
 */
export function request(method, url, data = {}, baseURL = '/api') {
  return http({ method, url, data, baseURL, responseType: 'json' })
    .then((res) => res.data)
    .catch((err) => {
      console.error('[request]', method, url, err);
      return {
        code: -1,
        msg: getRequestErrorMessage(err),
      };
    });
}

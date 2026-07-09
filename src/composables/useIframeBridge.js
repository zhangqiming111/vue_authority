import { STORAGE_KEYS, IFRAME_DASHBOARD_URL } from '@/constants/storage';

/** 向 iframe 子页面发送鉴权参数 */
export function postIframeAuth(iframeEl) {
  if (!iframeEl?.contentWindow) return;

  iframeEl.contentWindow.postMessage({
    tenantId: localStorage.getItem(STORAGE_KEYS.TENANT_ID),
    accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  }, '*');
}

export { IFRAME_DASHBOARD_URL };

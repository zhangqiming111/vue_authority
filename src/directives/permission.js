import { STORAGE_KEYS } from '@/constants/storage';

export default {
  install(app) {
    app.directive('permission', {
      mounted(el, binding) {
        const permissions = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.PERMISSIONS) || '[]'
        );
        const allowed = !permissions.length || permissions.includes(binding.value);
        el.style.display = allowed ? '' : 'none';
      },
    });
  },
};

import { defineStore } from 'pinia';
import { routerApi } from '@/api/router';

export const useRouterStore = defineStore('router', {
  state: () => ({
    routerList: [],
  }),
  actions: {
    async fetchRouters() {
      const res = await routerApi.query();
      if (res.code === 0) {
        this.routerList = res.data;
      }
      return res;
    },
  },
});

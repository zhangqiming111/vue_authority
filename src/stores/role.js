import { defineStore } from 'pinia';
import { roleApi } from '@/api/role';

export const useRoleStore = defineStore('role', {
  state: () => ({
    roleList: [],
  }),
  actions: {
    async fetchRoles() {
      const res = await roleApi.query();
      if (res.code === 0) {
        this.roleList = res.data;
      }
      return res;
    },
  },
});

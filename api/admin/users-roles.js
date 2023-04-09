export default $axios => ({

  async index(page) {
      return await $axios.$get('/v1/admin/users/roles?page=' + page);
  },

  async search(params) {
      return await $axios.$get('/v1/admin/users/roles/search', {
        params: {
          search: params
        }
      });
  },

})

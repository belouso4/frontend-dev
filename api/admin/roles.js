export default $axios => ({

  async index(page = 1) {
    return await $axios.$get('/v1/admin/roles?page='+page);
  },

  async create(name) {
      return await $axios.$post('/v1/admin/role', name);
  },

  async edit(id) {
      return await $axios.$get('/v1/admin/role/' + id);
  },

  async permissions() {
      return await $axios.$get('/v1/admin/permissions');
  },

  async permissionUpdate(role,permission) {
      return await $axios.$put(`/v1/admin/role/${role}/permission`,
        permission
      );
  },

  async permissionsDefault(role) {
      return await $axios.$get(`/v1/admin/role/${role}/permissions-default`);
  },

  async permissionsMinimum(role) {
      return await $axios.$get(`/v1/admin/role/${role}/permissions-minimum`);
  },

  async update(role, data) {
      return await $axios.$post('/v1/admin/role/'+role, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  },

  async delete(role) {
      return await $axios.$delete('/v1/admin/role/'+role);
  },

  async search( query ){
      return await $axios.$get('/v1/admin/roles/search', {
        params: {
          ...query
        }
      });
  },

})

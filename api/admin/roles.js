export default $axios => ({

  async index(page) {
    try {
      return await $axios.$get('/v1/admin/roles?page='+page);
    } catch (err) {
    }
  },

  async create(name) {
    try {
      return await $axios.$post('/v1/admin/role', name);
    } catch (err) {
      console.log('$axios')
    }
  },

  async edit(id) {
    try {
      return await $axios.$get('/v1/admin/role/' + id);
    } catch (err) {
      console.log('$axios')
    }
  },

  async permissions() {
    try {
      return await $axios.$get('/v1/admin/permissions');
    } catch (err) {
      console.log('$axios')
    }
  },

  async permissionUpdate(role,permission) {
    try {
      return await $axios.$put(`/v1/admin/role/${role}/permission`,
        permission
      );
    } catch (err) {
      console.log('$axios')
    }
  },

  async permissionsDefault(role) {
    try {
      return await $axios.$get(`/v1/admin/role/${role}/permissions-default`);
    } catch (err) {
      console.log('$axios')
    }
  },

  async permissionsMinimum(role) {
    try {
      return await $axios.$get(`/v1/admin/role/${role}/permissions-minimum`);
    } catch (err) {
      console.log('$axios')
    }
  },

  async update(role, data) {
    try {
      return await $axios.$post('/v1/admin/role/'+role, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (err) {
      console.log('$axios')
    }
  },

  async delete(role) {
    try {
      return await $axios.$delete('/v1/admin/role/'+role);
    } catch (err) {
      console.log('$axios')
    }
  },
  //
  // async users(id) {
  //   try {
  //     return await $axios.$get(`/v1/admin/role/${id}/users`);
  //   } catch (err) {
  //   }
  // },

})

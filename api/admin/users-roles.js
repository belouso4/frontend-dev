export default $axios => ({

  async index(page) {
      return await $axios.$get('/v1/admin/users-roles?page=' + page);
  },

  async search(params) {
      return await $axios.$get('/v1/admin/users/roles', {
        params: {
          ...params
        }
      });
  },

  // async filter(roles_name) {
  //   try {
  //     return await $axios.$get('/v1/admin/users/roles/', {
  //       params: {
  //         filter: roles_name
  //       }
  //     });
  //   } catch ( err ){
  //     console.log(err)
  //   }
  // },


  // async edit(id){
  //   try {
  //
  //     return await $axios.$get('/v1/admin/user/edit/'+id);
  //   } catch ( err ){
  //     console.log('$axios')
  //   }
  // },
  //
  // async update(id, role){
  //   try {
  //
  //     return await $axios.$put('/v1/admin/user/'+id, {role: role});
  //   } catch ( err ){
  //     console.log('$axios')
  //   }
  // },

})

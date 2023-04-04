export default $axios => ({

  async index(page) {
      return await $axios.$get('/v1/admin/users?page='+page);
  },

  async create(data){
      return await $axios.$post('/v1/admin/user', data);
  },

  async edit(id){
      return await $axios.$get('/v1/admin/user/edit/'+id, { progress: false });
  },

  async update(id, data){
      return await $axios.$post('/v1/admin/user/'+id, data, {
        progress: false,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  },

  async delete( id ){
      return await $axios.$delete('/v1/admin/user/delete/'+id);
  },

  async search( query ){

      return await $axios.$get('/v1/admin/user/search', {
        params: {
          ...query
        }
      });
  },
})

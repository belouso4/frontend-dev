export default $axios => ({

  async index(page) {
      return await $axios.$get('/v1/admin/tags?page='+page);
  },

  async create( data ){
      return await $axios.$post('/v1/admin/tag/create', data);
  },

  async update(id, data){
      return await $axios.$put('/v1/admin/tag/update/'+id, data);
  },

  async delete( data){
      return await $axios.$delete('/v1/admin/tag/delete/'+data);
  },

  async search( query ){
      return await $axios.$get('/v1/admin/tags/search', {
        params: {
          ...query
        }
      });
  },
})

export default $axios => ({

  async index(param) {
      return await $axios.$get('/v1/admin/categories', {params: param});
  },

  async create( data ){
      return await $axios.$post('/v1/admin/category/create', data);
  },

  async updateMenu(categories){
      return await $axios.$put('/v1/admin/categories/update', categories);
  },

  async update(id, data){
      return await $axios.$put('/v1/admin/category/update/'+id, data);
  },

  async delete( id ){
      return await $axios.$delete('/v1/admin/category/delete/'+id);
  },
})

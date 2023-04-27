export default $axios => ({

  async index(page, take = null) {
      return await $axios.$get('/v1/admin/posts', {params: {page, take}});
  },

  async edit(slug){
      return await $axios.$get('/v1/admin/post/'+slug+'/edit');
  },

  async create( data ){
      return await $axios.$post('/v1/admin/post/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  },

  async update( data, slug ){
      return await $axios.$post('/v1/admin/post/update/'+slug, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  },

  async delete( id ){
      return await $axios.$delete('/v1/admin/post/delete/'+id);
  },

  async restore( id ){
      return await $axios.$put('/v1/admin/post/restore/'+id);
  },

  async getDeletedPosts(page){
      return await $axios.$get('/v1/admin/posts/trashed?page='+page);
  },

  async deleteDeletedPosts( id ){
      return $axios.$delete('/v1/admin/posts/clear-trashed/'+id);
  },

  async search( query ){
      return await $axios.$get('/v1/admin/posts/search', {
        params: {
          ...query
        }
      });
  },

})

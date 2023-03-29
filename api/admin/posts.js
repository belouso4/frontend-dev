export default $axios => ({

  async index(page) {
    try {
      return await $axios.$get('/v1/admin/posts?page='+page);
    } catch ( err ){

    }
  },

  async edit(slug){
    try {
      return await $axios.$get('/v1/admin/post/'+slug+'/edit');
    } catch ( {response} ){
      // console.log('Это ошибка',response)
      // throw response
    }
  },

  async create( data ){
    try {

      return await $axios.$post('/v1/admin/post/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch ( err ){
      console.log(err)
    }
  },

  async update( data, slug ){
    try {
      return await $axios.$post('/v1/admin/post/update/'+slug, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch ( err ){
      console.log(err)
      return err
    }

  },

  async delete( id ){
    try {
      return await $axios.$delete('/v1/admin/post/delete/'+id);
    } catch ( err ){
      console.log(err)
    }
  },

  async restore( id ){
    try {
      return await $axios.$put('/v1/admin/post/restore/'+id);
    } catch ( err ){
      console.log(err)
    }
  },

  async getDeletedPosts(page){
    try {
      return await $axios.$get('/v1/admin/posts/trashed?page='+page);
    } catch ( err ){
      console.log(err)
    }

  },

  async deleteDeletedPosts( id ){
    try {
      return $axios.$delete('/v1/admin/posts/clear-trashed/'+id);
    } catch ( err ){
      console.log(err)
    }

  },

  async search( query ){
    try {
      return await $axios.$get('/v1/admin/posts/search', {
        params: {
          ...query
        }
      });
    } catch ( err ){
      console.log(err)
    }
  },

})

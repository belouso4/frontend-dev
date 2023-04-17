export default $axios => ({

  async index(id, page) {
      return await $axios.$get('/v1/category/' + id +'/articles?page='+page);
  },

  // async index(page) {
  //     return await $axios.$get('/v1/posts?page='+page);
  // },

  async show(slug){
      return await $axios.$get('/v1/article/' + slug);
  },

  async like( id ){
    return await $axios.$post('/v1/article/'+id+'/like');
  },
})

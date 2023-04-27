export default $axios => ({

  async index(page) {
    return await $axios.$get('/v1/admin/other/sliders');
  },

  async update(ids) {
    return await $axios.$post('/v1/admin/other/sliders', ids);
  },

  // async index(page) {
  //     return await $axios.$get('/v1/posts?page='+page);
  // },

  // async show(slug){
  //   return await $axios.$get('/v1/article/' + slug);
  // },
  //
  // async like( id ){
  //   return await $axios.$post('/v1/article/'+id+'/like');
  // },
})

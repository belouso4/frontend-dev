export default $axios => ({

  async index(page) {
      return await $axios.$get('/v1/posts?page='+page);
  },

  async show(slug){
      return await $axios.$get('/v1/post/'+slug);
  },

  async like( slug ){
    return await $axios.$post('/v1/post/'+slug+'/like');
  },
})

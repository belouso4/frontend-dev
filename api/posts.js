export default $axios => ({

  async index(page) {
    try {
      return await $axios.$get('/v1/posts?page='+page);
    } catch ( err ){

    }
  },

  async show(slug){
    try {
      return await $axios.$get('/v1/post/'+slug);
    } catch ( err ){
      console.log(err)
    }

  },

  async like( slug ){
    return await $axios.$post('/v1/post/'+slug+'/like');
  },

})

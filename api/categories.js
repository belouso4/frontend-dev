export default $axios => ({

  async index() {
      return await $axios.$get('/v1/categories');
  },

})

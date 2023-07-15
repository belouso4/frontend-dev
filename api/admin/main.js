export default $axios => ({

  async characteristics(type) {
    return await $axios.$get('/v1/admin/characteristics', {params: {type}});
  },

  async postRating(type) {
    return await $axios.$get('/v1/admin/post-rating', {params: {type}});
  },

})

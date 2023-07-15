export default $axios => ({

  async index(id, page) {
    return await $axios.$get('/v1/other/sliders');
  },

  async posts(take, order) {
    return await $axios.$get('/v1/other/posts', {params: {take, order}});
  },
})

export default $axios => ({

  async index(id, page) {
    return await $axios.$get('/v1/other/sliders');
  },
})

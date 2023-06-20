export default $axios => ({

  async index(offset) {
    return await $axios.$get('/v1/tags', {params: {offset}});
  },

  async show(slug, page) {
    return await $axios.$get('/v1/tags/'+slug, {params: {page}});
  },

})

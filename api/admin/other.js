export default $axios => ({

  async index(limit = null) {
    return await $axios.$get('/v1/admin/other/sliders', {params: {limit}});
  },

  async update(ids) {
    return await $axios.$post('/v1/admin/other/sliders', ids);
  },

  async add(id) {
    return await $axios.$post('/v1/admin/other/slider', id);
  },

  async uploadImage(data) {
    return await $axios.$post('/v1/admin/other/slider/update', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  async delete(id) {
    return await $axios.$delete("/v1/admin/other/slider/"+id);
  },
})

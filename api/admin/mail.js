export default $axios => ({

  async send(data) {
    return await $axios.$post('/v1/admin/mail', data);
  },
  async search(query) {
    return await $axios.$get('/v1/admin/mail/search', {
      params: {
        query: query
      }
    });
  },

})

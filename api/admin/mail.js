export default $axios => ({

  async send(data) {
    return await $axios.$post('/v1/admin/mail', data);
  },

})

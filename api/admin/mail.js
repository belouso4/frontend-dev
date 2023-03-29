export default $axios => ({

  async send(data) {
    try {
      return await $axios.$post('/v1/admin/mail', data);
    } catch ( err ){

    }
  },

})

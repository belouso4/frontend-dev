export default $axios => ({
  async search( query ){
    return await $axios.$get('/v1/admin/search', {
      params: {
        ...query
      }
    })
  },

  async profile(data){
    return await $axios.$post('/v1/admin/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

})


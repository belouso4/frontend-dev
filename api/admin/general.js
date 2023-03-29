export default $axios => ({
  async search( query ){
    try {
      return await $axios.$get('/v1/admin/search', {
        params: {
          ...query
        }
      })
    } catch ( err ){
      console.log(err)
    }
  },

  async profile(data){
    try {

      return await $axios.$post('/v1/admin/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch ( err ){
      console.log(err)
    }
  },

})


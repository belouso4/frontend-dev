export default $axios => ({

  async index(page) {
    try {
      return await $axios.$get('/v1/admin/users?page='+page);
    } catch ( err ){
      console.log(err)
    }
  },

  async create(data){
    try {
      return await $axios.$post('/v1/admin/user', data);
    } catch ( err ){
      console.log(err)
    }
  },

  async edit(id){
    try {

      return await $axios.$get('/v1/admin/user/edit/'+id);
    } catch ( err ){
      console.log(err)
    }
  },

  async update(id, data){
    try {

      return await $axios.$post('/v1/admin/user/'+id, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch ( err ){
      console.log(err)
    }
  },

  async delete( id ){
    try {
      return await $axios.$delete('/v1/admin/user/delete/'+id);
    } catch ( err ){
      console.log(err)
    }
  },

  async search( query ){
    try {
      return await $axios.$get('/v1/admin/user/search', {
        params: {
          search: query
        }
      });
    } catch ( err ){
      console.log(err)
    }
  },

})

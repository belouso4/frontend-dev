export default $axios => ({

    async auth(){
      return await $axios.$get('/v1/user');
    },

    async update( $id , data ){
      return $axios.$post('/v1/user/'+$id, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      });
    },

})

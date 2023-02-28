export default $axios => ({
    async auth(){
        try {
            return await $axios.$get('/v1/user');
        } catch (err) {

      }
    },

    async update( $id , data ){
        try {
            return $axios.$post('/v1/user/'+$id, data, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            });
        } catch (err) {

        }
    },
})

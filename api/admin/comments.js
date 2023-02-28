export default $axios => ({

  async getComments(post_slug, offset){
    try {
      return $axios.$get('/v1/admin/post/'+post_slug+'/comments', {params: {offset: offset}});
    } catch ( err ){
      console.log(err)
    }
  },

  async addComment(post_slug, data){
    try {
      return $axios.$post('/v1/admin/post/'+post_slug+'/comment', data);
    } catch ( err ){
      console.log(err)
    }
  },

  async likeComment(id ){
    try {
      return $axios.$post('/v1/admin/post/comment/'+id+'/like');
    } catch ( err ){
      console.log(err)
    }
  },

  async deleteComment(id ){
    try {
      return $axios.$delete('/v1/admin/post/comment/'+id+'/delete');
    } catch ( err ){
      console.log(err)
    }
  },

})

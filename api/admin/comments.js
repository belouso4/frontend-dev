export default $axios => ({

  async getComments(post_slug, offset){
    return $axios.$get('/v1/admin/post/'+post_slug+'/comments', {params: {offset: offset}});
  },

  async addComment(post_slug, data){
    return $axios.$post('/v1/admin/post/'+post_slug+'/comment', data);
  },

  async likeComment(id ){
    return $axios.$post('/v1/admin/post/comment/'+id+'/like');
  },

  async deleteComment(id ){
    return $axios.$delete('/v1/admin/post/comment/'+id+'/delete');
  },

})

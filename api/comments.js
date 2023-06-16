export default $axios => ({

  async index(slug, offset, comment_id) {
    return await $axios.$get('/v1/article/'+slug+'/comments', {
      params: {
        offset,
        comment_id
      }
    });
  },

  async addComment(slug, data) {
    return await $axios.$post('/v1/article/'+slug+'/comment', data);
  },

  async likeComment(id) {
    return await $axios.$post('/v1/article/comment/'+id+'/like');
  }

})

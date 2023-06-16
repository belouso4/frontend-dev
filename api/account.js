export default $axios => ({

  async liked(take = 0) {
    return await $axios.$get('/v1/account/liked', {params: {take}});
  },

  async viewed(take = 0) {
    return await $axios.$get('/v1/account/viewed', {params: {take}});
  },

  async commented(take = 0) {
    return await $axios.$get('/v1/account/commented', {params: {take}});
  },

})

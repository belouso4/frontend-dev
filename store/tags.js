export const state = () => ({
  tags: {},
  loading: false
})

export const actions = {
  async fetchTags({commit}, page) {
    commit('setLoading')

    const tags = await this.$api.adminTags.index(page)

    commit('setTags', tags)
    commit('setLoading', false)
    return tags
  },

  async searchTags({commit}, query) {
    commit('setLoading')

    const tags = await this.$api.adminTags.search(query)

    commit('setTags', tags)
    commit('setLoading', false)
    return tags
  },
}

export const mutations = {
  setTags( state, data) {
    state.tags = data
  },
  updateTag( state, data) {
    state.tags.data
      = state.tags.data.map(obj => obj.id === data.id ? data : obj)
  },
  setLoading( state, load = true) {
    state.loading = load
  },
}

export const getters = {
  getTags: state => state.tags,
  loading: state => state.loading,
}

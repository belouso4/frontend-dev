export const state = () => ({
  tags: [],
  page: 0,
})

export const actions = {
  async fetchTags({commit, state}) {
    try {
      const tags = await this.$api.tag.index(state.page)

      commit('setTags', tags)
      commit('setPage', tags.length < 20 ? true : null)
      return tags
    } catch (err) {console.log(err)}

  },
}

export const mutations = {
  setTags( state, data) {
    state.tags.push(...data)
  },

  setPage( state, data = null) {
    if (data) {
      state.page = null
    } else {
      state.page++
    }
  },
}

export const getters = {
  getTags: state => state.tags,
}

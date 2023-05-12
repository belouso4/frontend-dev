export const state = () => ({
  posts: [],
  slider: [],
  loading: false,
  selectedSlide: {},
  sliderCopy: [],
  limit: null,
  total: null
})

export const actions = {
  async fetchSlider({commit, state}, limit = null) {
    try {
      commit('setLoading')

      const slider = await this.$api.adminOther.index(limit ?? state.limit)

      commit('setTotal', slider.count)
      commit('setSlider', slider.data)
      commit('setSliderCopy', [...slider.data])
    } catch (err) {console.log(err)}

    commit('setLoading', false)
    return true
  },
}

export const mutations = {
  setPosts( state, data) {
    state.posts = data
  },

  setSlider( state, data) {
    state.slider = data
  },

  pushSlider( state, data) {
    state.slider.push(...data)
  },

  unshiftSlider( state, data) {
    state.slider.unshift(data)
  },

  setSliderCopy( state, slider) {
    state.sliderCopy = slider
  },

  pushSliderCopy( state, data) {
    state.sliderCopy.push(...data)
  },

  setSelectedSlide( state, slide) {
    state.selectedSlide = slide
  },

  setLoading( state, load = true) {
    state.loading = load
  },

  setSliderLimit(state) {
    state.slider.splice(5)
    state.sliderCopy.splice(5)
  },

  setLimit(state, limit = 'all') {
    state.limit = limit
  },

  setTotal(state, total) {
    state.total = total
  }

}

export const getters = {
  getPosts: state => state.posts,
  getSlider: state => state.slider,
  loading: state => state.loading,
  getSelectedSlide: state => state.selectedSlide,
  getSliderCopy: state => state.sliderCopy,
  getLimit: state => state.limit,
  getTotal: state => state.total,
}

export const state = () => ({
  loader: false,
  searchModal: false,
})

export const actions = {

}

export const mutations = {

  toggleReload (state, reload) {
    state.loader = reload
  },

  setSearchModal (state, value = true) {
    state.searchModal = value
  },

}

export const getters = {
  getReloadStatus: state => state.loader,
  getSearchModal: state => state.searchModal,
}

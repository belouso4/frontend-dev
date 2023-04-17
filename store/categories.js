export const state = () => ({
  categories: {},
  loading: false,
  selectedCategory: {},
  categoriesCopy: []
})

export const actions = {
  async fetchCategories({commit}, query) {
    try {
      commit('setLoading')

      const categories = await this.$api.adminCategories.index(query)

      commit('setCategories', categories)
      commit('setCategoriesCopy', [...categories])
    } catch (err) {console.log(err)}

    commit('setLoading', false)
    return true
  },

  async updateCategories({commit, dispatch}, data) {
    commit('setLoading')

    try {
      const categories = await this.$api.adminCategories.updateMenu(data)

      commit('setCategories', categories)
      commit('setCategoriesCopy', [...categories])

      this.$toaster.success('Данные успешно обновлены!')
    } catch (err) {console.log(err)}

    commit('setLoading', false)
    return true
  },


}

export const mutations = {
  setCategories( state, data) {
    state.categories = data
  },

  setLoading( state, load = true) {
    state.loading = load
  },

  setSelectedCategory( state, category) {
    state.selectedCategory = category
  },

  setCategory( state, category) {
    state.selectedCategory[category.key] = category.value
  },

  setCategoriesCopy( state, category) {
    state.categoriesCopy = category
  },
}

export const getters = {
  getCategories: state => state.categories,
  loading: state => state.loading,
  getSelectedCategory: state => state.selectedCategory,
  getCategoriesCopy: state => state.categoriesCopy,
}

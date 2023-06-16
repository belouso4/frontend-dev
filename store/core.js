export const state = () => ({
  categories: [],
})

export const actions = {
  load({commit}, data) {
    commit('setCategories', data.categories)
  },
   async validCategory({commit, state}, {path, slug= null}) {
    if (!state.categories.length) commit('setCategories', await this.$api.category.index())

    const category =  await state.categories

    let url = (path.endsWith('/') ? path.slice(0, -1) : path)
      .split('/')
      .splice(1)

     if(slug) {
       var index = url.indexOf(slug);
       if (index !== -1) {
         url.splice(-2, 2);
       }
     }

    function arrLen(arr, int) {
      const cat = arr.find(obj => obj.slug === url[int])
      if(!cat) return false

      int++
      if(cat && cat.children?.length && url.length !== int) {
        return arrLen(cat.children, int)
      }

      return cat
    }

    return arrLen(category, 0)?.id
  }
}

export const mutations = {
  setCategories( state, categories) {
    state.categories = categories
  },
}

export const getters = {
  getCategories: state => state.categories,
}

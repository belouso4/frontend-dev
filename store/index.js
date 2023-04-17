export const actions = {
  async nuxtServerInit({ dispatch, commit }) {
      try {
        const categories = await this.$api.category.index()

        await dispatch('core/load', {
          categories
        })
      } catch (err) {console.log(err)}
  },
}


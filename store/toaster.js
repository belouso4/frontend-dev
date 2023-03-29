export const state = () => ({
  toast:{
    show: false,
    timeoutLink: null
  },
  toaster: [],
  number: 0
})

export const actions = {
  setToasterShow ({commit, state}, data) {
    let id = state.number
    let timeout = setTimeout(function () {
      commit('hideToaster', id)

      setTimeout(() => {
        commit('clearToaster', id)
      }, 2000)

    },5000)

    let toast = {
      show: data.show,
      color: data.color,
      msg: data.msg,
      timeoutLink:
      timeout,
      id
    }

    commit('setToaster', toast)
    commit('numberPlus')
  },

  setToasterTimeout ({commit, state}, id) {
    let index = state.toaster.findIndex(object => object.id === id)
    let timeoutLink = state.toaster[index].timeoutLink

    clearTimeout(timeoutLink);
  },

  setStartTimeout ({commit, state}, id) {
    let timeout = setTimeout(function () {
      commit('hideToaster', id)

      setTimeout(() => {
        commit('clearToaster', id)
      }, 2000)

    },5000)

    commit('StartTimeout', {timeoutLink: timeout, id})
  },
}

export const mutations = {
  setToaster (state, data) {
    state.toaster.push(data)
  },

  hideToaster (state, id) {
    let index = state.toaster.findIndex(object => object.id === id)
    state.toaster[index].show=false
  },

  clearToaster (state, id) {
    let index = state.toaster.findIndex(object => object.id === id)
    state.toaster.splice(index, 1)
  },

  StartTimeout(state, data) {
    let index = state.toaster.findIndex(object => object.id === data.id)
    state.toaster[index].timeoutLink=data.timeoutLink
  },

  numberPlus(state) {
    state.number++
  }

}

export const getters = {
  getToaster: state => state.toaster
}

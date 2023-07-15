export const state = () => ({
  breadcrumbs: [],
  breadcrumbsTabs: []
})

export const mutations = {
  set(state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs;
  },

  push(state, breadcrumb) {
    state.breadcrumbs.push(breadcrumb)
  },

  pop(state) {
    state.breadcrumbs.pop();
  },

  replace(state, payload) {
    const index = state.breadcrumbs.findIndex((breadcrumb) => {
      return breadcrumb.text === payload.find;
    });

    if (index) {
      state.breadcrumbs.splice(index, 1, payload.replace);
    }
  },
  empty(state) {
    state.breadcrumbs = [];
  },

  pushTab(state, breadcrumb) {
    state.breadcrumbsTabs.push(breadcrumb)
  },

  removeTab(state, breadcrumb) {
    const index = state.breadcrumbsTabs.findIndex((item) => {
      return item.path === breadcrumb;
    });

    if (index > -1) {
      state.breadcrumbsTabs.splice(index, 1);
    }
  },
}

export const getters = {
  getUsers: state => state.users,
  // loading: state => state.loading,
}

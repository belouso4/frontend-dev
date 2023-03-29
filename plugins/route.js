export default ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    let breadcrumbs = store.state.breadcrumbs.breadcrumbsTabs
    let index = breadcrumbs.findIndex(bred => bred.name === to.name)
    let onlyPathWithAdmin = to.path.split('/').indexOf('admin')

    if (from.path !== '/' &&  (onlyPathWithAdmin > -1) &&  !(index > -1)) {
      store.commit('breadcrumbs/pushTab', {name: to.name, path: to.path})
    }

    next()
  })
}

import {nav} from '~/json/data.json'

export default ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    let breadcrumbs = store.state.breadcrumbs.breadcrumbsTabs
    let index = breadcrumbs.findIndex(bred => bred.path === to.path)
    let onlyPathWithAdmin = to.path.split('/').indexOf('admin')

    if (from.path !== '/' &&  (onlyPathWithAdmin > -1) &&  !(index > -1)) {
      if (nav[to.name])
        store.commit('breadcrumbs/pushTab', {name: nav[to.name], path: to.path})
    }
    next()
  })
}

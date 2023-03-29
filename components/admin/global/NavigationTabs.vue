<template>
  <div class="nav navbar navbar-expand navbar-white navbar-light border-bottom p-0">
    <div class="nav-item dropdown">
      <a class="nav-link bg-danger dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Close</a>
      <div class="dropdown-menu mt-0">
        <a class="dropdown-item" href="#" data-widget="iframe-close" data-type="all">Close All</a>
        <a class="dropdown-item" href="#" data-widget="iframe-close" data-type="all-other">Close All Other</a>
      </div>
    </div>
    <a @click="scroll($event)" class="nav-link bg-light" href="#" data-widget="iframe-scrollleft"><i class="fas fa-angle-double-left"></i></a>
    <ul class="navbar-nav overflow-hidden" role="tablist">
      <li v-for="crumb in $store.state.breadcrumbs.breadcrumbsTabs" :class="['nav-item', {'active': activeClass(crumb.path, $route.path) }]" role="presentation">
        <a @click="$store.commit('breadcrumbs/removeTab', crumb.path)" class="btn-iframe-close cursor-pointer" data-widget="iframe-close" data-type="only-this"><i class="fas fa-times"></i></a>
        <nuxt-link :to="crumb.path" :class="['nav-link', {'active': activeClass(crumb.path, $route.path) }]" data-toggle="row" id="tab-pages-charts-flot-html" href="#panel-pages-charts-flot-html"
                   role="tab" aria-controls="panel-pages-charts-flot-html" aria-selected="true">
          {{ crumb.name }}
        </nuxt-link>
      </li>
    </ul>
    <a @click="scroll($event)" class="nav-link bg-light" href="#" data-widget="iframe-scrollright"><i class="fas fa-angle-double-right"></i></a>
    <a class="nav-link bg-light" href="#" data-widget="iframe-fullscreen"><i class="fas fa-expand"></i></a>
  </div>
</template>

<script>
export default {
  name: "NavigationTabs",
  methods: {
    activeClass(path, pathC) {
      return path === pathC
    },

    scroll(e) {
      const arrow = e.target.nodeName === 'A'
        ? e.target
        : e.target.parentElement
      const direction = arrow.getAttribute('data-widget')

      direction === "iframe-scrollleft"
        ? arrow.nextElementSibling.scrollLeft -= 20
        : arrow.previousElementSibling.scrollLeft += 20
    }
  }
}
</script>

<style scoped>

</style>

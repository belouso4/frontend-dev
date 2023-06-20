<template>
  <div class="wrapper-post">
    <template v-if="posts?.length">
      <PostCard v-for="post in posts" :post="post" :key="'post-'+post.id"/>
      <client-only>
        <infinite-loading v-if="posts?.length" spinner="spiral" @infinite="infiniteScroll">
          <div slot="no-results">Результатов больше нет :(</div>
        </infinite-loading>
      </client-only>
    </template>
    <p v-else>Нет постов</p>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
  name: "posts",
  layout: 'AppMain',

  validate({ params, query, store, route }) {
    return store.dispatch('core/validCategory', {path: route.path})
  },

  head() {
    return {
      title: this.title_main
    }
  },

  async asyncData({ $api, route, store }) {
    try {
      const id = await store.dispatch('core/validCategory', {path: route.path})
      const posts = await $api.posts.index(id, 1)

      store.commit('core/setTitle', posts.title_main)

      return {posts: posts.data, page: 1, idCategory: id}
    } catch (err) {console.log(err)}
  },

  computed: {
    ...mapGetters('core', {
      title_main: 'getTitle'
    })
  },

  methods: {
    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
    }),

    async infiniteScroll($state) {
      this.page++;
      const posts = await this.$api.posts.index(this.idCategory, this.page)

      this.posts.push(...posts.data)

        if(this.posts.length !== posts.meta.total) {
          $state.loaded();
        } else {
          $state.complete()
        }
    },

  },

  activated() {
    this.setBreadcrumbs([
      { text: 'Главная', to: { path: '/' }},
      { text: this.title_main},
    ]);
  },
}
</script>

<style>

</style>

<template>
  <div class="wrapper-post">
    <template v-if="posts?.length">
      <PostCard v-for="post in posts" :post="post" :key="'post-'+post.id"/>
      <client-only>
        <infinite-loading v-if="posts?.length && posts.length >= 10" spinner="spiral" @infinite="infiniteScroll">
          <div slot="no-results">Результатов больше нет :(</div>
        </infinite-loading>
      </client-only>
    </template>
    <p v-else>Нет постов</p>
  </div>
</template>
<script>

import {mapGetters, mapMutations} from "vuex";

export default {
  name: "posts",
  layout: 'AppMain',

  head() {
    return {
      title: this.title_main
    }
  },

  async asyncData({ $api, params, store }) {
    try {
      const posts = await $api.tag.show(params.slug, 1)
      store.commit('core/setTitle', posts.title_main)

      return {posts: posts.data, page: 1}
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
      try {
        this.page++;

        const slug = this.$route.params.slug
        const posts = await this.$api.tag.show(slug, this.page)

        this.posts.push(...posts.data)

        if(this.posts.length !== posts.meta.total) {
          $state.loaded();
        } else {
          $state.complete()
        }
      } catch (err) {}
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

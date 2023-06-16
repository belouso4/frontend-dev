<template>
  <section class="section-posts">
    <div class="container">
      <div class="main-header">
        <h1>Последние новости</h1>
        <Breadcrumbs/>
      </div>
      <div class="flex-position">
        <aside>
          <div class="aside-title">
            Категория новостей
          </div>
          <div class="tags">
            <a>Спорт</a>
            <a>Мотивация</a>
            <a>Игры</a>
            <a>Технологии</a>
            <a>Музыка</a>
          </div>
        </aside>
        <div class="wrapper-post">
          <PostCard v-for="post in posts" :post="post" :key="'cafe-'+post.id"/>
          <client-only>
            <infinite-loading v-if="posts?.length" spinner="spiral" @infinite="infiniteScroll">
              <div slot="no-results">Результатов больше нет :(</div>
            </infinite-loading>
          </client-only>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: "posts",
  layout: 'AppMain',
  validate({store, route }) {
    return store.dispatch('core/validCategory', {path: route.path})
  },

  async asyncData({ $api, route, store }) {
    try {
      const id = await store.dispatch('core/validCategory', {path: route.path})
      const posts = await $api.posts.index(id, 1)

      return {posts, page: 1}
    } catch (err) {console.log(err)}
  },

  data() {
    return {
      posts: {},
      page: 0,
      metadata: {
        title: 'Свежие посты',
        description: 'Свежие посты'
      }
    }
  },

  created() {
    this.setBreadcrumbs([
      { text: 'Главная', to: { path: '/' }},
      { text: 'Новости'},
    ]);
  },

  methods: {
    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
    }),

    infiniteScroll($state) {
      setTimeout(async () => {
        this.page++; // next page

        const posts = await this.$api.posts.index(this.page)

        index.data.unshift(...this.posts.data)
        this.posts = index

        if(index.data.length > 1 && index.to) {
          $state.loaded();
        } else {
          $state.complete()
        }
      }, 500);
    },
  },
}
</script>

<style>

.news-item {
  height: 260px;
}

.news-item img {
  height: 100%;
  object-fit: cover;
  object-position: left;
}
</style>

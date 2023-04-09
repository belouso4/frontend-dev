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
          <PostCard v-for="post in posts.data" :post="post" :key="'cafe-'+post.id"/>
          <client-only>
            <infinite-loading v-if="posts.data?.length" spinner="spiral" @infinite="infiniteScroll"></infinite-loading>
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

  async asyncData({ $api }) {
    try {
      let page = 1
      const posts = await $api.posts.index(1)
      return {posts, page}
    } catch (err) {}
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
    console.log(this.posts)
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





  // beforeRouteLeave (to, from , next) {
  //   const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  //   if (answer) {
  //     next()
  //   } else {
  //     next(false)
  //   }
  // }

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

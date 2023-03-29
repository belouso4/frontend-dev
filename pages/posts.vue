<template>
  <section class="section-posts">
    <div class="container">
      <div class="main-header">
        <h1>Последние новости</h1>
        <ul class="breadcrumbs">
          <li class="breadcrumb-item"><nuxt-link to="/"><i class="fa-solid fa-house"></i></nuxt-link></li>
          <li class="breadcrumb-item active">Новости</li>

        </ul>
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
            <infinite-loading v-if="posts.data.length" spinner="spiral" @infinite="infiniteScroll"></infinite-loading>
          </client-only>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import PostCard from "../components/PostCard";

export default {
  name: "posts",
  components: {PostCard},
  layout: 'AppMain',
  head: {
    title: 'Последние новости',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Последние новости',
      },
    ],
  },

  data() {
    return {
      posts: {},
      page: 0,
    }
  },

  created() {
    console.log(this.posts)
  },

  async asyncData({app}) {
    let page = 1
    const posts = await app.$api.posts.index(1)
    return {posts, page}
  },

  methods: {
    infiniteScroll($state) {
      setTimeout(async () => {
        this.page++; // next page

        const posts = await this.$api.posts.index(this.page)

        posts.data.unshift(...this.posts.data)
        this.posts = posts

        if(posts.data.length > 1 && posts.to) {
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
  object-fit: contain;
  object-position: left;
}
</style>

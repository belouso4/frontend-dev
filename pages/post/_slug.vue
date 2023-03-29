<template>

  <section class="section-posts">
    <div class="container">
      <div class="main-header">
        <h1>Последние новости</h1>
        <ul class="breadcrumbs">
          <!--            <li>-->
          <!--              <a href="">OwnHouse</a>-->
          <!--            </li>-->
          <!--            <li>-->
          <!--              <p>Новости</p>-->
          <!--            </li>-->
          <li class="breadcrumb-item"><nuxt-link to="/"><i class="fa-solid fa-house"></i></nuxt-link></li>
          <li class="breadcrumb-item"><nuxt-link to="/posts">Новости</nuxt-link></li>
          <li class="breadcrumb-item active">{{ post.title }}</li>
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
          <h1>{{ post.title }}</h1>
          <img height="560" :src="BASE_URL + '/posts/' + post.img" alt="">
          <p v-if="post.excerpt != 'null'">{{ post.excerpt }}</p>
          <div class="news-item-area_desc" v-html="post.desc"></div>
          <Comments :comments="comments"/>
        </div>
      </div>
    </div>
  </section>



</template>

<script>
import { mapGetters } from "vuex";
import Comments from "../../components/Comments";

export default {
  name: 'addPost',
  components: {Comments},
  layout: 'AppMain',
  head() {
    return {
      title: this.post.meta_title ?? this.post.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.post.meta_desc ?? this.post.title,
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.post.meta_keywords ?? '',
        },
      ],
    }
  },

  data() {
    return {
      post: {},
      comments: {},
      BASE_URL: process.env.API_BASE_URL_IMG,
    }
  },

  async asyncData({app, params,error}) {
      const [post, comments] = await Promise.all([
        app.$api.posts.show(params.slug),
        app.$api.comments.index(params.slug, 0)
      ]);
      return {post, comments}
  },

  created() {
    // console.log('rr', this.comments)
  }

}
</script>

<style>

</style>

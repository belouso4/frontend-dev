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
          <h1>{{ post.title }}</h1>
          <img height="560" :src="post.img" alt="">
<!--          <p v-if="post.excerpt != 'null'">{{ post.excerpt }}</p>-->
          <div class="news-item-area_desc" v-html="post.desc"></div>
          <Comments :comments="comments"/>
        </div>
      </div>
    </div>
  </section>



</template>

<script>
import {mapMutations} from "vuex";
import Comments from "../../components/Comments";
import socialMetadata from '~/mixins/social-metadata'

export default {
  name: 'addPost',
  components: {Comments},
  layout: 'AppMain',
  mixins: [socialMetadata],

  data() {
    return {
      post: {},
      comments: {},
    }
  },

  async asyncData({app, params,error}) {
      const [post, comments] = await Promise.all([
        app.$api.posts.show(params.slug),
        app.$api.comments.index(params.slug, 0)
      ]);
      return {post, comments}
  },

  methods: {
    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
      pushBreadcrumb: 'push',
      popBreadcrumb: 'pop',
      replaceBreadcrumb: 'replace',
      emptyBreadcrumbs: 'empty'
    }),
  },

  created() {
    this.setBreadcrumbs([
      { text: 'Главная', to: { path: '/' }},
      { text: 'Новости', to: { path: '/posts' }},
      { text: ':user' } // placeholder
    ]);

    this.replaceBreadcrumb({
      find: ':user',
      replace: { text: this.post.title }
    });
  }

}
</script>

<style>

</style>

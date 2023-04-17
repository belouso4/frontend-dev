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
import Comments from "../../../../components/Comments";


export default {
  name: 'addPost',
  components: {Comments},
  layout: 'AppMain',

  async validate({ params, route, query, store }) {
    let validCategory = await store.dispatch('core/validCategory', {
      path: route.path,
      slug: params.slug
    })

    return !!params.slug && !!validCategory
  },

  async asyncData({$api, params,}) {
    try {
      const [post, comments] = await Promise.all([
        $api.posts.show(params.slug),
        $api.comments.index(params.slug, 0)
      ]);

      return {post, comments}
    } catch (err) {console.log(err)}
  },

  data() {
    return {
      baseURL: process.env.BASE_URL,
      post: {}
    }
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

  async created() {
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

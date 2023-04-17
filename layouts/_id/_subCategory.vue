<template>

  <section class="section-posts">
<!--    <div class="container">-->
<!--      <div class="main-header">-->
<!--        <h1>Последние новости</h1>-->
<!--        <Breadcrumbs/>-->
<!--      </div>-->

<!--      <div class="flex-position">-->
<!--        <aside>-->
<!--          <div class="aside-title">-->
<!--            Категория новостей-->
<!--          </div>-->
<!--          <div class="tags">-->
<!--            <a>Спорт</a>-->
<!--            <a>Мотивация</a>-->
<!--            <a>Игры</a>-->
<!--            <a>Технологии</a>-->
<!--            <a>Музыка</a>-->
<!--          </div>-->
<!--        </aside>-->
<!--        <div class="wrapper-post">-->
<!--          <h1>{{ post.title }}</h1>-->
<!--          <img height="560" :src="post.img" alt="">-->
<!--&lt;!&ndash;          <p v-if="post.excerpt != 'null'">{{ post.excerpt }}</p>&ndash;&gt;-->
<!--          <div class="news-item-area_desc" v-html="post.desc"></div>-->
<!--&lt;!&ndash;          <Comments :comments="comments"/>&ndash;&gt;-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </section>



</template>

<script>
import {mapMutations} from "vuex";
import Comments from "../../components/Comments";


export default {
  name: 'addPost',
  components: {Comments},
  layout: 'AppMain',


  // async asyncData({$api, params,error}) {
  //   try {
  //     const [post, comments] = await Promise.all([
  //       $api.posts.show(params.slug),
  //       $api.comments.index(params.slug, 0)
  //     ]);
  //
  //     return {post, comments}
  //   } catch (err) {console.log(err)}
  // },

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

  created() {
    console.log('file sub', this.$route)

    let url = this.$route.path.endsWith('/') ? this.$route.path.slice(0, -1) : this.$route.path
    url = url.split('/').splice(1)
    console.log(url)
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

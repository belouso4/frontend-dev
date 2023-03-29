<template>

              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><nuxt-link to="/admin"><i class="fa-solid fa-house"></i></nuxt-link></li>
                <li class="breadcrumb-item"><nuxt-link to="/admin/posts">Посты</nuxt-link></li>
                <li class="breadcrumb-item active">Создание нового поста</li>
              </ol>
<!--              <ol class="breadcrumb float-sm-right">-->
<!--                <li class="breadcrumb-item"><nuxt-link to="/admin"><i class="fa-solid fa-house"></i></nuxt-link></li>-->
<!--                <li class="breadcrumb-item" v-for="(crumb, index) in crumbs">-->
<!--                  <nuxt-link :to="crumb.path">-->
<!--                  {{ $route.fullPath === crumb.path && title !== null ? title : crumb.name }}-->
<!--                  </nuxt-link>-->
<!--                </li>-->

<!--              </ol>-->


<!--  <ol-->
<!--    vocab="http://schema.org/"-->
<!--    typeof="BreadcrumbList"-->
<!--  >-->
<!--    <li property="itemListElement" typeof="ListItem">-->
<!--      <NLink property="item" typeof="WebPage" to="/">-->
<!--        <span property="name">Vonage Learn</span>-->
<!--      </NLink>-->
<!--      <meta property="position" content="1" />-->
<!--    </li>-->
<!--    <li-->
<!--      v-for="(crumb, index) in crumbs"-->
<!--      :key="index"-->
<!--      property="itemListElement"-->
<!--      typeof="ListItem"-->
<!--    >-->
<!--      <NLink property="item" typeof="WebPage" :to="crumb.path">-->
<!--        <span property="name">{{-->
<!--            $route.fullPath === crumb.path && title !== null ? title : crumb.title-->
<!--          }}</span>-->
<!--      </NLink>-->
<!--      <meta property="position" :content="index + 2" />-->
<!--    </li>-->
<!--  </ol>-->
</template>

<script>
export default {
  name: "Breadcrumbs",
  props: {
    title: {
      type: String,
      default: null,
    },
  },
  created() {
    // console.log( this.$route.matched);
    // console.log('crumb', this.crumbs)
  },
  computed: {
    crumbs() {
      // const fullPath = this.$route.fullPath
      // const params = fullPath.startsWith('/')
      //   ? fullPath.substring(1).split('/')
      //   : fullPath.split('/')
      // const crumbs = []
      // let path = ''
      // params.forEach((param, index) => {
      //   path = `${path}/${param}`
      //   const match = this.$router.match(path)
      //   if (match.name !== null) {
      //     crumbs.push(match)
      //   }
      // })
      // return crumbs
    },
  },
}
</script>

<style scoped>

</style>

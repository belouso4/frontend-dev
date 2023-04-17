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

  validate({ params, query, store, route }) {
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

  async created() {
    // console.log(this.$route)
    // console.log(this.posts)
    // console.log('param', this.$route.param)
    // console.log(this.$route.path.split('/').splice(0))
    // console.log('category', this.category)
    // let array = ['ii', 'chatgpt']
    // let object = [
    //   {
    //     id: 1,
    //     slug: 'ii',
    //     child: [
    //       {
    //         id: 3,
    //         slug: 'chatgpt'
    //       }
    //     ]
    //   },
    //   {
    //     id: 2,
    //     slug: 'wefwfw',
    //     child: [
    //       {
    //         id: 4,
    //         slug: 'fwefw'
    //       }
    //     ]
    //   }
    // ]

    // console.log('disp', await )
    // const category = this.$store.state.core.categories
    // let url = this.$route.path.endsWith('/')
    //   ? this.$route.path.slice(0, -1)
    //   : this.$route.path
    // url = url.split('/').splice(1)
    //
    // console.log('_category',this.$route)
    //
    //
    // function arrLen(arr, int) {
    //   if (url.length === int) return
    //
    //
    //   const cat = arr.find(obj => obj.slug === url[int])
    //   // console.log('cat', cat)
    //
    //   int++
    //   if(cat && cat.child?.length) return arrLen(cat.child, int);
    //
    //   return cat
    // }
    //
    // console.log(arrLen(category, 0)?.id)

    // console.log(this.$route.path.split('/').splice(1))
    // let id = null



    // console.log(array.splice(0, (array.length - 1)))


    // object.filter(o => array[0] === o.slug)

    // function recurFindUrl(el) {
    //   for (let i of object) {
    //     if (el === i.slug) return i;
    //   }
    //
    //   return false
    // }
    //
    // for (let p of array.splice(0, (array.length - 1))) {
    //   if (recurFindUrl(p)) {
    //     const elem = recurFindUrl(p).child
    //     console.log(p)
    //     console.log(recurFindUrl(elem))
    //   }
    //
    // }

//     let ergeg = products.find((product) => {
//       return product.items.some((item) => {
// //^^^^^^
//         return item.name === 'milk';
//       });
//     });








    // console.log(object)


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

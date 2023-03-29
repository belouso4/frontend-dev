<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Каталог пользователей</h1>
          </div>
          <div class="col-sm-6">

          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <section class="content">

      <div v-for="(items, index) in data">

        <strong>{{index === 'posts' ? 'Посты' : 'Пользователи'}}</strong>
        <ul>
          <li v-for="item in items.data">
            <p>
              {{item.id}}
          </p>
            <p>
              {{index === 'posts' ? item.title : item.name}}
            </p>
          </li>
          <li></li>
        </ul>
      </div>
<!--      <div>-->
<!--        <strong>Пользователи</strong>-->
<!--        <ul>-->
<!--          <li>-->
<!--            <p>-->
<!--            id-->
<!--          </p>-->
<!--            <p>-->
<!--              title-->
<!--            </p>-->
<!--          </li>-->
<!--          <li></li>-->
<!--        </ul>-->
<!--      </div>-->

      <!-- /.card -->
    </section>

  </div>
</template>

<script>
export default {
  name: "search",
  layout: 'Admin',
  async asyncData({app, params, store}) {
    const data = await app.$axios.$get('/v1/admin/search', {
      params: {
        search: 'Никита'
      }
    });
    return {data}
  },

  created() {
   console.log('data',this.data)
  },
}
</script>

<style scoped>

</style>

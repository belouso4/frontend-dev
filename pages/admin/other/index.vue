<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Другое</h1>
          </div>
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Другое']" />
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <section class="content">
      <div class="container-fluid">

        <SliderSection/>

      </div>
      <!-- /.card -->
    </section>

  </div>
</template>

<script>
import SliderSection from "../../../components/admin/other/slider/SliderSection.vue";

export default {
  name: "index",
  layout: 'Admin',
  components: {SliderSection},
  async asyncData({$api, store}) {
    try {
      const posts = await $api.adminPosts.index(1, 5)
      await store.dispatch('slider/fetchSlider')

      store.commit('slider/setPosts', posts)
    } catch (err) {console.log(err)}
  },
}
</script>

<style>

</style>

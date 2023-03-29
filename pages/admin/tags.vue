<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Теги</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><nuxt-link to="/admin"><i class="fa-solid fa-house"></i></nuxt-link></li>
              <li class="breadcrumb-item active">Теги</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div>
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <create-tag/>
          <tag-table/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import CreateTag from "../../components/admin/tags/CreateTag";
import TagTable from "../../components/admin/tags/TagTable";
export default {
  name: 'tags',
  components: {TagTable, CreateTag},
  layout: 'Admin',

  head() {
    return {
      title: 'Теги',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Теги',
        },
      ],
    }
  },

  async asyncData({app,store}) {
    const tags = await app.$api.adminTags.index(1)
    await store.commit('tags/setTags', tags)
    return {tags}
  }

}
</script>

<style scoped>







</style>

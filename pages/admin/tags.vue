<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Теги</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Теги']" />
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

  async asyncData({$api,store}) {
    try {
      const tags = await $api.adminTags.index(1)
      await store.commit('tags/setTags', tags)

      return {tags}
    } catch (err) {console.log(err)}
  }
}
</script>

<style scoped>

</style>

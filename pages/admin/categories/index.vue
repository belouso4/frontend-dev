<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Категории</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Категории']" />
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div>
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <create-category :checkChanges="checkChanges"/>
          <client-only>
            <list-category :checkChanges="checkChanges" :categories.sync="categories"/>
          </client-only>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CreateCategory from "../../../components/admin/categories/CreateCategory";
import ListCategory from "../../../components/admin/categories/ListCategory";
import { mapGetters } from "vuex";

export default {
  components: {CreateCategory, ListCategory},
  layout: 'Admin',

  async asyncData({$api,store}) {
    try {
      const categories = await $api.adminCategories.index()
      store.commit('categories/setCategories', categories)
      store.commit('categories/setCategoriesCopy', [...categories])

    } catch (err) {console.log(err)}
  },

  computed: {
    ...mapGetters({
      categoriesCopy: 'categories/getCategoriesCopy',
      categories: 'categories/getCategories'
    }),
  },

  methods: {
    checkChanges() {
      let categoriesNewCopy = JSON.parse ( JSON.stringify ( this.categories) )
      let categoriesOldCopy = JSON.parse ( JSON.stringify ( this.categoriesCopy))

      return this.compareObjects(
        this.changeFormatCategories(categoriesOldCopy),
        this.changeFormatCategories(categoriesNewCopy)
      )
    },

    compareObjects(x, y) {
      var objectsAreSame = true;

      for (let i = 0; x.length > i; i++) {
        for(var propertyName in x[i]) {
          if(x[i][propertyName] !== y[i][propertyName]) {
            objectsAreSame = false;
            break;
          }
        }
      }

      return objectsAreSame;
    },

    changeFormatCategories(categories, parent_id = null) {
      let categoryNormalFormat = []

      for (let i = 0; categories.length > i; i++) {
        categoryNormalFormat.push(categories[i])

        if (categories[i]?.children?.length) {
          let children = this.changeFormatCategories(categories[i].children, categories[i].id)
          categoryNormalFormat.push(...children)
        }

        categories[i].parent_id = parent_id
        delete categories[i].children
      }

      return categoryNormalFormat
    },
  }

}
</script>

<style scoped>

</style>

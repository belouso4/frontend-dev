<template>
  <div class="col-md-8">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Список категорий</h3>
        <div class="card-tools d-flex align-items-center">
        </div>
      </div>
      <div class="card-body position-relative">
        <vue-nestable :maxDepth="2" v-model="categories">
          <vue-nestable-handle
            slot-scope="{ item }"
            :item="item">
            <div class="drag-item d-flex justify-content-between align-items-center">
              <div>
                <i class="fa-solid fa-bars"></i>
                <span>{{ item.name }}</span>
                <span>{{ item.slug }}</span>
              </div>
              <div>
                <button @click="editCategory(item)" class="btn btn-sm" type="button" title="Редактировать"><i class="fas fa-pencil-alt"></i></button>
                <button @click="remove(item.id)" class="btn btn-sm" type="button" title="Удалить"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </vue-nestable-handle>
        </vue-nestable>
        <div v-if="loading" class="spinner-load">
          <Loader/>
        </div>
      </div>
      <div class="card-footer note-float d-flex justify-content-between">
        <button @click="reset()" class="btn btn-default delete-btn">
          Сбросить изменения
        </button>
        <button-loader @fetch="updateCategories" :disabled="checkChanges()">
          Cохранить
        </button-loader>
      </div>
    </div>
    <modal-category :show.sync="show"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalCategory from "./ModalCategory";
import { VueNestable, VueNestableHandle } from 'vue-nestable'
import 'vue-nestable/example/assets/vue-nestable.css'

export default {
  components: {VueNestable, VueNestableHandle, ModalCategory},

  props: {
    checkChanges: {
      type: Function,
    }
  },

  data() {
    return {
      show: false,
    }
  },

  watch: {
    categories(val) {
      this.checkChanges()
    }
  },

  computed: {
    ...mapGetters({
      loading: 'categories/loading',
      categoriesCopy: 'categories/getCategoriesCopy'
    }),

    categories: {
      get() {
        return this.$store.getters["categories/getCategories"]
      },
      set(value) {
        this.$store.commit('categories/setCategories', value)
      }
    },
  },

  methods: {
    async remove(id) {
      if (!this.checkChanges()) { return this.$toaster.warning('Список категорий был изменен , сохраните или сбросьте дынные') }
      try {
        this.$store.commit('categories/setLoading', true)

        await this.$api.adminCategories.delete(id)
        await this.$store.dispatch('categories/fetchCategories')

      } catch (err) {console.log(err)}
      this.$store.commit('categories/setLoading', false)
    },

    editCategory(item) {
      this.show = true
      this.$store.commit('categories/setSelectedCategory', {...item})
    },

    async updateCategories() {
      let categoryCopy = JSON.parse ( JSON.stringify ( this.categories) )
      let categories = this.changeFormatCategories(categoryCopy)

      if (this.checkDuplicateSlug(categories)) {
        return this.$toaster.error('Повторяющийся url категории.')
      }

      await this.$store.dispatch('categories/updateCategories', categories)
    },

    checkDuplicateSlug(categories) {
      var result = false;
      let parentIds = categories.map(e => e.parent_id)

      parentIds = [...new Set(parentIds)]

      for (let i = 0; parentIds.length > i; i++) {
        let elemWithParent_id = categories.filter(e => e.parent_id === parentIds[i])

        if (elemWithParent_id.length >= 2) {
          var valueArr = elemWithParent_id.map(item =>item.slug);

          var isDuplicate = valueArr.some(function(item, idx){
            return valueArr.indexOf(item) !== idx
          });

          if (isDuplicate){
            result = true;
            break
          }
        }

      }

      return result;
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

    reset() {
      this.$store.commit('categories/setCategories', this.categoriesCopy)
    }
  }
}
</script>

<style scoped>
.nestable-item-content .drag-item {
  background: #5a6268;
  color: #fff;
  border-radius: 0.25rem;
  padding: 7px;
}

.nestable-item-content .drag-item > div:first-child i {
  margin-right: 10px;
  opacity: 0.4;
}

.nestable-item-content a {
  margin-right: 10px;
  opacity: 0.4;
}

.nestable-item-content button {
  color: #fff;
  opacity: 0.4;
}

.drag-item > div:first-child {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.drag-item > div:first-child span:last-child {
  color: #9ca1a4;
  margin-left: 10px;
}


</style>

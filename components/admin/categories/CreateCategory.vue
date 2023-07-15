<template>
  <div class="col-md-4">
    <div class="card card-primary">

      <form action="" @submit.prevent="create()">
        <div class="card-header">
          Добавление категории
        </div>
        <div class="card-body">

          <form-group :validator="$v.form.name" label="Название категории" attribute="">
            <input v-model="form.name" type="text" class="form-control" id="tag-name" placeholder="Введите категорию">
          </form-group>

          <form-group :validator="$v.form.slug" label="slug" attribute="slug">
            <input v-model="form.slug" type="text" class="form-control" id="tag-slug" placeholder="Введите slug категории">
          </form-group>
          <div class="form-group">
            <label>Позиция в меню</label>
            <div class="custom-control custom-radio">
              <input type="radio"
                     class="form-check-input "
                     id="privateCheck1"
                     v-model="status"
                     value="0">
              <label class="form-check-label cursor-pointer" for="privateCheck1">Родительская категория</label>
            </div>
            <div class="custom-control custom-radio">
              <input type="radio"
                     class="form-check-input"
                     id="publicCheck1"
                     v-model="status"
                     value="1">
              <label class="form-check-label cursor-pointer" for="publicCheck1">Вложенная категория</label>
            </div>
          </div>
          <form-group v-if="+status === 1" label="Категории">
            <Options :inputShow="false"
                     :list.sync="categories"
                     :name.sync="categoryName"
                     :fetch="fetchCategories"
                     :status="!!categories.length">
              <li v-for="category in categories"
                  @click="setCategory(category)"
                  class="select2-results__option"
                  :class="{'active': +form.parent_id === +category.id}">
                {{ category.name }}
              </li>
            </Options>

          </form-group>

        </div>

        <div class="card-footer">
          <button-loader :loading="!(!loading || !loadBtn)">
            Сохранить
          </button-loader>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import {maxLength, minLength, required} from "vuelidate/lib/validators";
import {mapGetters} from "vuex";

export default {
  props: {
    checkChanges: Function
  },

  data() {
    return {
      loadBtn: false,
      status: 0,
      categories: [],
      categoryName: '',
      form: {
        name: 'новые гаджеты',
        slug: '',
        parent_id: null,
        order: 0,
      }
    }
  },

  watch: {
    status(val) {
      if (+val === 0) {
        this.form.parent_id = null
      } else {
        // this.fetchCategories()
      }
    }
  },

  validations() {
    return {
      form: {
        name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(50)
        },
        slug: {
          maxLength: maxLength(50)
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      loading: 'categories/loading',
    }),
  },

  methods: {
    async create(e) {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        if (!this.checkChanges()) {
          return this.$toaster.warning('Список категорий был изменен , сохраните или сбросьте дынные')
        }

        try {
          this.$store.commit('categories/setLoading', true)
          this.loadBtn = true

          const data = {...this.form}
          if (!data.parent_id) delete data.parent_id

          await this.$api.adminCategories.create(data)
          const categories = await this.$store.dispatch('categories/fetchCategories')

          this.resetForm()
          this.loadBtn = false
        } catch (err) {
          this.$store.commit('categories/setLoading', false)
        }
      }
    },

    async fetchCategories() {
      this.categories = await this.$api.adminCategories.index({fetch: 'all'});
    },

    resetForm() {
      this.$v.$reset()
      this.form.name = ''
      this.form.slug = ''
    },

    setCategory(category) {
      this.form.parent_id = category.id
      this.categoryName = category.name
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <modal :show.sync="show" @close-modal="closeModal">
    <template>
      <div v-if="loading" class="overlay">
        <i class="fas fa-2x fa-sync fa-spin"></i>
      </div>
      <div class="modal-header">
        <h4 class="modal-title">Редактирование категории</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span @click="closeModal" aria-hidden="true">×</span>
        </button>
      </div>
      <form @submit.prevent="updateCategory()">

        <div class="modal-body">
          <form-group :validator="$v.form.name" label="Название категории">
            <input :value="form.name" @input="updateObj('name', $event)" type="text" class="form-control" placeholder="Введите категории">
          </form-group>
          <form-group :validator="$v.form.slug" label="Slug категории">
            <input :value="form.slug" @input="updateObj('slug', $event)" type="text" class="form-control" placeholder="Введите slug категории">
          </form-group>
        </div>
        <div class="modal-footer justify-content-between">
          <button @click="closeModal()" type="button" class="btn btn-outline-light">Отмена</button>
          <button type="submit" class="btn btn-outline-dark">
            <span>Сохранить</span>
          </button>
        </div>
      </form>

    </template>
  </modal>
</template>

<script>
import Modal from "../global/Modal";
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: "CreateRoleModal",
  components: {Modal},
  props: {
    show: Boolean
  },
  data() {
    return {
      loading: false
    }
  },

  validations() {
    return {
      form: {
        name: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(255)
        },
        slug: {
          minLength: minLength(3),
          maxLength: maxLength(255)
        },
      }
    }
  },

  computed: {
    form: {
      get() {
        return this.$store.getters['categories/getSelectedCategory']
      }
    }
  },

  methods: {
    updateObj(key, e) {
      this.$store.commit('categories/setCategory', {key, value: e.target.value})
    },

    async updateCategory() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.loading = true

      try {
        await this.$api.adminCategories.update(this.form.id, this.form)
        await this.$store.dispatch('categories/fetchCategories')

        this.closeModal()
      } catch (err){console.log(err)}

      this.loading = false
    },

    closeModal() {
      this.$emit("update:show", false)
      this.$v.$reset()
    },
  },
}
</script>


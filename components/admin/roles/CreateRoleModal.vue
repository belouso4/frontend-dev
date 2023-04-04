<template>
  <modal :show.sync="show" @close-modal="closeModal">
    <template>
      <div v-if="loading" class="overlay">
        <i class="fas fa-2x fa-sync fa-spin"></i>
      </div>
      <div class="modal-header">
        <h4 class="modal-title"></h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span @click="closeModal" aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body">
        <form-group :validator="$v.form.name" label="Название Роли">
          <input v-model="form.name" type="text" class="form-control" id="header-name" placeholder="Введите заголовок">
        </form-group>
      </div>
      <div class="modal-footer justify-content-between">
        <button @click="closeModal()" class="btn btn-outline-light">Отмена</button>
        <button @click="createRole()" class="btn btn-outline-dark">
          <span>Создать</span>
        </button>
      </div>
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
      form: {
        name: '',
      },
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
      }
    }
  },

  methods: {
    async createRole() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.loading = true

      try {
        let role = await this.$api.adminRoles.create(this.form)
        this.$router.push({
          path: '/admin/roles/'+role.id
        })
        this.closeModal()

      } catch (err){console.log(err)}

      this.loading = false
    },

    closeModal() {
      this.$emit("update:show", false)
      this.form.name = ''
      this.$v.$reset()
    },
  },
}
</script>

<style>
.modal-footer button {
  min-width: 140px;
  height: 38px;
}

.modal-footer .spinner-button {
  width: 100%;
  height: 100%;
}

.modal-footer .spinner-button img{
  width: auto;
  height: 100%;
  margin: 0 auto;
}
</style>

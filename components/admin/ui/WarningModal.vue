<template>
  <modal :show.sync="show" @close-modal="closeModal" :margin-lg="'margin-lg'">
    <template>
      <div v-if="loading" class="overlay">
        <i class="fas fa-2x fa-sync fa-spin"></i>
      </div>
      <div class="modal-body">
        <p>
          Это действие удалит роль из базы данных без возможности восстановления.
          Пользователи имеющие данную роль потеряют разрешения.
          <br/>
          Вы уверены?
        </p>
      </div>
      <div class="modal-footer justify-content-between">
        <button @click="closeModal()" class="btn btn-outline-light">Отмена</button>
        <button @click="confirmModal()" class="btn btn-outline-light">
          <span>Удалить</span>
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "../global/Modal";
export default {
  name: "WarningModal",
  components: {Modal},
  props: {
    show: Boolean,
    action: Function,
    id: Number,
  },

  data() {
    return {
      loading: false,
      disable_closing: false
    }
  },

  methods: {
    closeModal() {
      if(!this.disable_closing) {
        this.$emit("update:show", false);
      }
    },

    async confirmModal() {
      this.disable_closing = true
      this.loading = true
      await this.action(this.id)
      this.loading = false
      this.disable_closing = true
      this.$emit('update:show', false)
    },
  },
}

</script>

<style scoped>

</style>

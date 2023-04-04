<template>
  <modal :show.sync="show" @close-modal="closeModal" :margin-lg="'margin-lg'">
    <template>
      <div v-if="loading" class="overlay">
        <i class="fas fa-2x fa-sync fa-spin"></i>
      </div>
      <!--          <div class="modal-header">-->
      <!--            <h4 class="modal-title">Secondary Modal</h4>-->
      <!--            <button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
      <!--              <span @click="closeModal" aria-hidden="true">×</span>-->
      <!--            </button>-->
      <!--          </div>-->
      <div class="modal-body">
        <p>
          Это действие перезапишет любые настраиваемые
          разрешения, которые вы могли применить к системным коллекциям.
          <br/>
          Вы уверены?
        </p>
      </div>
      <div class="modal-footer justify-content-between">
        <button @click="closeModal()" class="btn btn-outline-light">Отмена</button>
        <button @click="confirmModal()" class="btn btn-outline-dark">
          <span>Создать</span>
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
    disableClosing: Boolean,
  },

  data() {
    return {
      loading: false,
    }
  },

  methods: {
    closeModal() {
      if(!this.disableClosing) {
        this.$emit("update:show", false);
      }
    },

    async confirmModal() {
      this.$emit('update:disable-closing', true)
      this.loading = true
      await this.action()
      this.loading = false
      this.$emit('update:disable-closing', false)
      this.$emit('update:show', false)
    },
  },
}

</script>

<style scoped>

</style>

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
      <form @submit.prevent="updateSlide()">

        <div class="modal-body">
          <div class="form-group img" :class="{'img-set': imgShow}">
            <img v-if="!!imgShow" :src="imgShow ?? form.img" alt="">
            <div v-else class="upload-overlay">
              <i class="fas fa-cloud-arrow-up"></i>
            </div>
          </div>
          <form-group :validator="$v.img" label="Изображение">
            <div class="custom-file">
              <input @change="onFileChange" type="file" placeholder="Довавьте изображение" class="custom-file-input" id="customFile">
              <label class="custom-file-label" for="customFile">Довавьте изображение...</label>
            </div>
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
import Modal from "../../global/Modal.vue";
import {helpers, required} from "vuelidate/lib/validators";

let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const fileImg = (value) => {
  if (typeof value === 'string') return true
  return !helpers.req(value) || allowedExtension.indexOf(value.type) > -1
}

const filSize = (value) => {
  if (typeof value === 'string') return true
  return !helpers.req(value) || (value.size / 1024 / 1024) < 1
}

export default {
  name: "CreateRoleModal",
  components: {Modal},
  props: {
    show: Boolean
  },
  data() {
    return {
      loading: false,
      imgShow: null,
      img: ''
    }
  },

  validations() {
    return {
      img: {
        required,
        fileImg,
        filSize
      },
    }
  },

  computed: {
    form: {
      get() {
        return this.$store.getters['slider/getSelectedSlide']
      }
    }
  },

  methods: {
    async updateSlide() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.loading = true

      try {
        const data = {id: this.form.id, img: this.img}

        await this.$api.adminOther.uploadImage(this.formData(data))
        await this.$store.dispatch('slider/fetchSlider')

        this.closeModal()
      } catch (err){console.log(err)}

      this.loading = false
    },

    formData(data) {
      let formData = new FormData();

      Object.entries(data).forEach(val => {
        formData.append(val[0], val[1])
      })
      formData.append('_method', 'PUT');

      return formData
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      if (!files.length)
        return;

      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        vm.imgShow = e.target.result;
      };

      reader.readAsDataURL(files[0]);
      this.img = files[0]
    },

    closeModal() {
      this.$emit("update:show", false)
      this.$v.$reset()
      this.imgShow =null
    },
  },
}
</script>


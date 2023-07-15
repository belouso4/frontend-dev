<template>
  <div class="right-content">

    <form @submit.prevent="sendForm">
      <div class="user-avatar" @click="$refs.file.click()">
        <img :src="imgShow" alt="">
        <input @change="onFileChange" ref="file" type="file" style="display: none">
        <div class="overlay-avatar"><i class="fa-solid fa-camera"></i></div>
      </div>
      <form-group :validator="$v.form.avatar">
      </form-group>
      <form-group :validator="$v.form.name" label="Изменить имя">
        <input type="text" placeholder="Введите Имя" v-model="form.name">
      </form-group>
      <form-group :validator="$v.form.email" label="Изменить Email">
        <input type="text" placeholder="Email" v-model="form.email">
      </form-group>
      <form-group :validator="$v.form.old_password" label="Старый пароль">
        <input type="text" placeholder="Введите старый пароль" v-model="form.old_password">
      </form-group>
      <form-group :validator="$v.form.new_password" label="Новый пароль">
        <input type="text" placeholder="Введите новый пароль" v-model="form.new_password">
        <Meter :value="passwordStrength"></Meter>
      </form-group>
      <form-group :validator="$v.form.confirm_password" label="Повторите пароль">
        <input type="text" placeholder="Введите пароль повторно" v-model="form.confirm_password">
      </form-group>
      <div class="form-group">
        <button-loader :loading="loading">Сохранить</button-loader>
      </div>
    </form>
  </div>
</template>

<script>
import zxcvbn from 'zxcvbn'
import {mapMutations} from "vuex";
import {required, minLength, maxLength, helpers, email, sameAs} from 'vuelidate/lib/validators'
import ButtonLoader from "~/components/Ui/ButtonLoader.vue";

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
  name: "profile",
  components: {ButtonLoader},

  data(){
    return {
      loading: false,
      imgShow: this.$auth.user.avatar.original,
      form: {
        avatar: this.$auth.user.avatar.original,
        name: this.$auth.user.name,
        old_password: '',
        new_password: '',
        confirm_password: '',
        email: this.$auth.user.email,
      },
    }
  },

  validations() {
    return {
      form: {
        name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(255)
        },
        email: {
          required,
          email,
          maxLength: maxLength(255)
        },
        old_password: {
          minLength: minLength(6),
          maxLength: maxLength(255)
        },
        new_password: {
          minLength: minLength(6),
          maxLength: maxLength(255)
        },
        confirm_password: {
          sameAsPassword: sameAs('new_password')
        },
        avatar: {
          fileImg,
          filSize
        }
      }

    }
  },

  created() {
    this.setBreadcrumbs([
      { text: 'Главная', to: { path: '/' }},
      { text: 'Личны кабинет'},
    ]);
  },

  computed: {
    passwordStrength () {
      return zxcvbn(this.form.new_password).score
    },
  },

  methods: {
    async logout(){
      await this.$auth.logout();
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
      this.form.avatar = files[0]
    },

    async sendForm() {
      this.$v.$touch()
      if (this.$v.$invalid) return

      try {
        this.loading = true

        await this.$api.user.update(this.$auth.user.id, this.formData(this.form))
        this.$auth.fetchUser();

        this.$v.$reset()
      } catch (err) {console.log(err)}

      this.loading = false
    },

    formData(data) {
      let user = data
      let formData = new FormData();

      Object.entries(this.form).forEach(val => {
        formData.append(val[0], val[1])
      })
      formData.append('_method', 'PUT');

      return formData
    },

    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
    }),
  },
}
</script>

<style scoped>

</style>

<template>
  <div class="col-md-5">
    <div class="card card-primary">

      <form action="" @submit.prevent="create()">
        <div class="card-header">
          Добавление тега
        </div>
        <div class="card-body">

          <form-group :validator="$v.tag" label="Название тега" attribute=" ">
            <input v-model="tag" type="text" class="form-control" id="tag-name" placeholder="Введите тег">
          </form-group>

          <form-group :validator="$v.slug" label="slug">
            <input v-model="slug" type="text" class="form-control" id="tag-slug" placeholder="Введите url slug тега">
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
  name: "CreateTag",

  data() {
    return {
      tag: '',
      slug: '',
      loadBtn: false,
    }
  },

  validations() {
    return {
      tag: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(50)
      },
      slug: {
        maxLength: maxLength(50)
      }
    }
  },

  computed: {
    ...mapGetters({
      loading: 'admin/tags/loading'
    })
  },

  methods: {
    async create(e) {
      this.$v.$touch()
      if(!this.$v.$invalid) {
        // if (this.loading) {
        //   e.target.disabled=disabled
        // }
        try {
          this.$store.commit('admin/tags/setLoading', true)
          this.loadBtn = true
          await this.$api.adminTags.create({tag: this.tag, slug: this.slug})
          await this.$store.dispatch('admin/tags/fetchTags', 1)

          this.$v.$reset()
          this.loadBtn = false
          this.tag = ''
          this.slug = ''
        } catch (err) {
          this.$store.commit('admin/tags/setLoading', false)
        }
      }
    },
  }
}
</script>

<style scoped>
.error-text {
  color: red;
  margin-top: 4px;
}
</style>

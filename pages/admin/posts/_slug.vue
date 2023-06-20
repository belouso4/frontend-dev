<template>
  <div class="tab-content">

    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">{{ title }}</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Посты', title]" />
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8">
            <div class="card card-primary">
              <div class="card-body">
                <form-group :validator="$v.form.title" label="Заголовок">
                  <input v-model="form.title"
                         type="text"
                         :class="['form-control', {'is-invalid': $v.form.title.$error}]"
                         id="header-text" placeholder="Введите заголовок">
                </form-group>

                <form-group :validator="$v.form.desc" label="Описание">
                  <client-only>
                    <text-editor v-model="form.desc"/>
                  </client-only>
                </form-group>

                <form-group label="Небольшое описание">
                  <textarea v-model="form.excerpt" @input="textAreaAdjust($event.target)"
                            type="text"
                            class="form-control textarea-resize"
                            id="except-textarea"
                            placeholder="Введите небольшое описание"></textarea>
                </form-group>

                <ul class="nav nav-tabs cursor-pointer" id="custom-content-below-tab" role="tablist">
                  <li class="nav-item" @click="tabShow = 'Metadata'">
                    <a class="nav-link" :class="[{active: tabShow === 'Metadata'}]">MetaData</a>
                  </li>
                  <li class="nav-item" @click="tabShow = 'Comments'">
                    <a class="nav-link" :class="[{active: tabShow === 'Comments'}]">
                      Comments
                      <i v-if="loadingComments" class="fas fa-3x fa-sync-alt fa-spin"></i>
                    </a>
                  </li>
                </ul>
                <div class="tab-content" id="custom-content-below-tabContent">
                  <transition mode="out-in" name="tabs">
                    <Metadata v-if="tabShow === 'Metadata'"
                              :meta-title.sync="form.meta_title"
                              :meta-desc.sync="form.meta_desc"
                              :meta-keywords.sync="form.keywords"/>
                    <Comments v-else-if="tabShow === 'Comments'"
                              :comments.sync="comments"
                              :loading-comments.sync="loadingComments"/>
                  </transition>
                </div>
              </div>
              <div class="card-footer">
                <span @click="delPost" class="cursor-pointer text-danger">Удалить запись</span>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card card-primary">
              <div class="card-body">
                <div class="form-group">
                  <label>Доступ</label>
                  <div class="custom-control custom-radio">
                    <input type="radio"
                           class="form-check-input "
                           id="privateCheck1"
                           v-model="form.status"
                           value="0">
                    <label class="form-check-label" for="privateCheck1">Приватный</label>
                  </div>
                  <div class="custom-control custom-radio">
                    <input type="radio"
                           class="form-check-input"
                           id="publicCheck1"
                           v-model="form.status"
                           value="1">
                    <label class="form-check-label" for="publicCheck1">Публичный</label>
                  </div>
                </div>

                <form-group :validator="$v.form.img" label="Изображение для превью">
                  <div class="custom-file">
                    <input @change="onFileChange" type="file" placeholder="Довавьте изображение" class="custom-file-input" id="customFile">
                    <label class="custom-file-label" for="customFile">Довавьте изображение...</label>
                  </div>
                </form-group>

                <div class="form-group img" :class="{'img-set': imgShow}">
                  <img v-if="!!imgShow" :src="imgShow" alt="">
                  <div v-else class="upload-overlay">
                    <i class="fas fa-cloud-arrow-up"></i>
                  </div>
                </div>
                <form-group label="Категории">
                  <Options :inputShow="false"
                           :list.sync="categories"
                           :name.sync="categoryName"
                           :fetch="fetchCategories"
                            :status="!!categories.length">

                      <li v-for="category in categories"
                          @click="setCategory(category)"
                          class="select2-results__option"
                          :class="{'active': +form.category_id === +category.id}">
                        {{ category.name }}
                      </li>
                  </Options>
                </form-group>
                <div class="form-group tags-controller">
                  <label  class="label-tags">Добавить теги</label><p></p>
                  <client-only>
                    <vue-tags-input
                      v-model="tag"
                      :tags="form.tags"
                      :allow-edit-tags="true"
                      :add-only-from-autocomplete="true"
                      :autocomplete-items="autocompleteItems"
                      class="tags-input"
                      @tags-changed="update">
                    </vue-tags-input>
                  </client-only>
                </div>
                <div class="form-check">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1">
                  <label class="form-check-label" for="exampleCheck1">Check me out</label>
                </div>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                <button-loader :fetch="sendBtn" :loading="loading">
                  Сохранить
                </button-loader>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TextEditor from "../../../components/admin/posts/TextEditor";
import Comments from "../../../components/admin/posts/Comments";
import Metadata from "../../../components/admin/posts/Metadata";
import {helpers, maxLength, minLength, required} from "vuelidate/lib/validators";

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
  name: 'addPost',
  components: {Metadata, Comments, TextEditor},
  middleware: 'permission',
  meta: {
    permission: 'post.edit'
  },
  layout: 'Admin',

  head() {
    return {
      title: 'Создание нового поста',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Создание нового поста',
        },
      ],
    }
  },

  async asyncData({$api, params}) {
    try {
      const post = await $api.adminPosts.edit(params.slug)
      const comments = await $api.adminPostComments.getComments(params.slug, 0)
      const categories = await $api.adminCategories.index({fetch: 'all'});

      post.tags = post.tags ? post.tags.map(a => ({text: a.tag, id: a.id})) : []
      post.keywords = post.meta_keywords
        ? post.meta_keywords.split(',').map(a => ({text: a}))
        : []
      const index = categories.findIndex(e => e.id === post.category_id)
      const categoryName = categories[index].name

      return {
        form:post,
        title: post.title,
        imgShow: post.img,
        comments,
        copy: {...post},
        categories,
        categoryName
      }
    } catch (err) {console.log(err)}
  },

  data() {
    return {
      tabShow: 'Metadata',
      loadingComments: false,
      showAnimate: true,
      tag: '',
      keywords: [],
      selectTags: '',
      autocompleteItems: [],
      debounce: null,
      imgShow: '',
      loading: false,
    }
  },

  validations() {
    return {
      form: {
        title: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(255)
        },
        desc: {
          required,
          minLength: minLength(4)
        },
        img: {
          required,
          fileImg,
          filSize
        }
      }
    }
  },

  watch:{
    'tag': 'initItems',
  },

  methods: {
    async sendBtn() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true

        try {
          const data = [this.formData(this.form), this.$route.params.slug]
          const slug = await this.$api.adminPosts.update(...data)

          if (slug === this.$route.params.slug) {
            this.$v.$reset()
            this.$toaster.success('Данные успешно сохраннены!')
            this.loading = false

            return await this.$nuxt.refresh()
          }
          await this.$router.push({path: '/admin/posts/'+slug})

          this.$v.$reset()
          this.$toaster.success('Данные успешно сохраннены!')
        } catch (err) {console.log(err)}

        this.loading = false
      }
    },

    formData(data) {
      let tags = []
      let keywords = []

      data.tags.forEach(tag => {
        tags.push(tag.id)
      })

      data.keywords.forEach(keyword => {
        keywords.push(keyword.text)
      })

      let formData = new FormData();

      Object.entries(data).forEach(val => {
        switch(val[0]) {
          case 'keywords':
            if (val[1].length) formData.append(val[0], keywords.join(','))
            break
          case 'tags':
              tags.forEach(id => formData.append(val[0]+'[]', id))
            break
          case 'img':
            if (val[1] !== '') formData.append(val[0], val[1])
            break
          default:
            formData.append(val[0], val[1])
            break
        }
      })
      formData.append('_method', 'PUT');

      return formData
    },

    update(newTags) {
      this.autocompleteItems = [];
      this.form.tags = newTags;
    },

    initItems() {
      if (this.tag.length < 2) return;
       clearTimeout(this.debounce);

      this.debounce = setTimeout(async () => {
        if (this.tag.length > 2) {
          try {
            let tags = (await this.$api.adminTags.search({search: this.tag})).data

            this.autocompleteItems = tags.filter(a => {
              let tag = this.tag.toLowerCase()
              let search = false

              if (a.tag.toLowerCase().indexOf(tag) !== -1 ) {
                search = true
              }

              if (a.slug.toLowerCase().indexOf(tag) !== -1 ) {
                search = true
              }

              return search;
            }).map(a => ({text: a.tag, id: a.id}));

          } catch (err) {console.log(err)}
        }

      }, 600)
    },

    async fetchCategories() {
      try {
        this.categories = await this.$api.adminCategories.index({fetch: 'all'});
      } catch (err) {console.log(err)}
    },

    setCategory(category) {
      this.form.category_id = category.id
      this.categoryName = category.name
    },

    async delPost() {
      try {
        await this.$api.adminPosts.delete(this.form.id)
        await this.$router.push({path: '/admin/posts'})
        this.$toaster.error('Запись №'+this.form.id+' удалена')
      } catch (err) {console.log(err)}
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
      this.form.img = files[0]
    },
    textAreaAdjust(el) {
      el.style.height = (el.scrollHeight > el.clientHeight)
        ? (25+ el.scrollHeight)+"px"
        : "100px";
    },
  },

  beforeRouteLeave (to, from , next) {
    console.log(this.form.desc ,'===', this.copy.desc)
    if ((this.form.title !== this.copy.title || this.form.desc !== this.copy.desc || this.form.img !== this.copy.img) && to.name !== 'admin-posts-slug') {
      if (window.confirm('Вы действительно хотите уйти? у вас есть несохраненные изменения!')) {
        next()
      } else {
        next(false)
      }
    } else next()
  }
}
</script>

<style>

</style>

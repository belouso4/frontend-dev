<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Создание нового поста</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <AdminUiBreadcrumbs :name="['Посты', 'Создание нового поста']" />
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
                      <input v-model="form.title" type="text"
                             :class="['form-control', {'is-invalid': $v.form.title.$error}]"
                             id="header-text"
                             placeholder="Введите заголовок">
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

                  <ul class="nav cursor-pointer nav-tabs" id="custom-content-below-tab" role="tablist">
                    <li class="nav-item" @click="tabShow = 'Metadata'">
                      <a class="nav-link active" :class="[{active: tabShow === 'Metadata'}]">MetaData</a>
                    </li>
                  </ul>
                  <div class="tab-content" id="custom-content-below-tabContent">
                    <transition mode="out-in" name="tabs">
                      <Metadata v-if="tabShow === 'Metadata'"
                                :meta-title.sync="form.meta_title"
                                :meta-desc.sync="form.meta_desc"
                                :meta-keywords.sync="form.keywords"/>
                    </transition>
                  </div>
                </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-primary">

                <div class="card-body">
                  <div class="form-group">
                    <!-- <label for="customFile">Custom File</label> -->
                    <label>Доступ</label>
                    <div class="custom-control custom-radio">
                      <input type="radio" class="form-check-input " id="privateCheck1" v-model="form.status" value="0">
                      <label class="form-check-label" for="privateCheck1">Приватный</label>
                    </div>
                    <div class="custom-control custom-radio">
                      <input type="radio" class="form-check-input" id="publicCheck1" v-model="form.status" value="1">
                      <label class="form-check-label" for="publicCheck1">Публичный</label>
                    </div>
                  </div>

                  <form-group :validator="$v.form.img" attribute="Изображение" label="Изображение для превью">
                    <div class="custom-file">
                      <input @change="onFileChange" type="file" placeholder="Довавьте изображение" class="custom-file-input" id="customFile">
                      <label class="custom-file-label" for="customFile">Довавьте изображение...</label>
                    </div>
                  </form-group>


                  <div class="form-group img" :class="{'img-set': imgShow}">
                    <img v-if="!!imgShow" :src="imgShow" alt="">
                    <div v-else @click="onUpload" class="upload-overlay">
                      <i class="fas fa-cloud-arrow-up"></i>
                    </div>
                  </div>
                  <div class="form-group tags-controller">
                    <label  class="label-tags">Добавить тег</label><p></p>
                    <client-only>
                      <vue-tags-input
                        v-model="tag"
                        placeholder="Добавить тег"
                        :tags="form.tags"
                        :add-only-from-autocomplete="true"
                        :autocomplete-items="autocompleteItems"
                        class="tags-input"
                        @tags-changed="update"
                      >
                      </vue-tags-input>
                    </client-only>

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
import Metadata from "../../../components/admin/posts/Metadata";
import { required, minLength, maxLength, helpers } from 'vuelidate/lib/validators'

let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

const fileImg = (value) => !helpers.req(value) || allowedExtension.indexOf(value.type) > -1
const filSize = (value) => !helpers.req(value) || (value.size / 1024 / 1024) < 1

export default {
  layout: 'Admin',
  name: 'addPost',
  components: {TextEditor, Metadata},
  middleware: 'permission',
  meta: {
    permission: 'post.create',
  },

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

  data() {
    return {
      tabShow: 'Metadata',
      showAnimate: true,
      autocompleteItems: [],
      debounce: false,
      tag: '',
      loading: false,
      form:{
        title: '',
        desc: '',
        excerpt: '',
        status: '1',
        img: '',
        tags: [],
        keywords: [],
        meta_title: '',
        meta_desc: ''
      },
      imgShow: false,
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
        excerpt: {
          minLength: minLength(4),
          maxLength: maxLength(255),
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
    async sendBtn(e) {
      console.log('qwfqf')
      this.$v.$touch()

      if (!this.$v.$invalid) {
        try {
          this.loading = true

          const slug = await this.$api.adminPosts.create(this.formData(this.form))
          await this.$router.push({path: `/admin/posts/${slug}`})

          this.$v.$reset()
          this.$toaster.success('Данные успешно сохраннены!')
        } catch (err) {}

        this.loading = false
      }
    },

    update(newTags) {
      this.autocompleteItems = [];
      this.form.tags = newTags;
    },

    initItems() {
      if (this.tag.length < 2) return;
      clearTimeout(this.debounce);

      this.debounce = setTimeout(async () => {
        try {
          let tags = await this.$api.adminTags.search({search: this.tag})

          this.autocompleteItems = tags.filter(a => {
            let toLowerCase =  a.tag.toLowerCase()

            return toLowerCase.indexOf(this.tag.toLowerCase()) !== -1;
          }).map(a => ({text: a.tag, id: a.id}));

        } catch (err) {console.log(err)}
      }, 600)
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
            formData.append('meta_keywords', keywords.join(','))
            break
          case 'tags':
            tags.forEach(id => formData.append(val[0]+'[]', id))
            break
          default:
            formData.append(val[0], val[1])
            break
        }
      })

      return formData
    },

    onUpload() {
      if(this.imgShow) {
        this.imgShow = ''
      } else {
        this.$el.querySelector('#customFile').click()
      }
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
    if ((this.form.title !== '' || this.form.desc !== '' || this.form.img !== '') && to.name !== 'admin-posts-slug') {
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

<template>
  <div class="tab-content">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Создание нового поста</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><nuxt-link to="/admin"><i class="fa-solid fa-house"></i></nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/admin/posts">Посты</nuxt-link></li>
              <li class="breadcrumb-item active">Создание нового поста</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div>
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8">
            <div class="card card-primary">
<!--                <div class="card-header">-->
<!--                  <h3 class="card-title">Quick Example</h3>-->
<!--                </div>-->
              <!-- /.card-header -->
              <!-- form start -->

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

                  <div class="form-group">
                    <label for="except-textarea">Небольшое описание</label>
                    <textarea v-model="form.excerpt" type="text" class="form-control" id="except-textarea" placeholder="Введите небольшое описание"></textarea>
                  </div>
                  <ul class="nav nav-tabs" id="custom-content-below-tab" role="tablist">
                    <li class="nav-item" @click="tabShow = 'Metadata'">
                      <a class="nav-link" :class="[{active: tabShow === 'Metadata'}]">MetaData</a>
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
                <!-- /.card-body -->
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-primary">
<!--                <div class="card-header">-->
<!--                  <h3 class="card-title">Quick Example</h3>-->
<!--                </div>-->
              <!-- /.card-header -->
              <!-- form start -->


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

                  <div class="form-group img">
                    <img v-if="imgShow ? true : false" :src="imgShow" alt="">
                  </div>
                  <div class="form-group tags-controller">
                    <label  class="label-tags">Добавить тег</label><p></p>
                    <client-only>
                      <vue-tags-input
                        v-model="tag"
                        :tags="form.tags"
                        :add-only-from-autocomplete="true"
                        :autocomplete-items="autocompleteItems"
                        class="tags-input"
                        @tags-changed="update"
                      >
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
                  <button @click="sendBtn" type="submit" class="btn btn-primary float-right">Сохранить</button>
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
import { required, minLength, between, helpers } from 'vuelidate/lib/validators'

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
      send: false,
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
          minLength: minLength(4)
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
    'form.img': {
      handler: function (after, before) {
        if (this.form.img !== '') {
          this.imgShow = true
        }
      },
      deep: true
    },
    'tag': 'initItems',
  },

  methods: {
    update(newTags) {
      this.autocompleteItems = [];
      this.form.tags = newTags;
    },

    initItems() {
      if (this.tag.length < 2) return;
      clearTimeout(this.debounce);

      this.debounce = setTimeout(() => {
        this.$api.adminTags.search({search: this.tag}).then(({data}) => {
          this.autocompleteItems = data.filter(a => {
            return a.tag.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
          }).map(a => ({text: a.tag, id: a.id}));
        })
      }, 600)

    },

    async sendBtn() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        await this.$api.adminPosts.create(this.formData(this.form)).then((slug) => {
          this.send = true
          this.$router.push({path: `/admin/posts/${slug}`})
          // this.clearForm()
        })

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
            formData.append(val[0], keywords.join(','))
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

    clearForm(){
      this.form.title         = '';
      this.form.desc          = '';
      this.form.excerpt       = '';
      this.form.status         = '1';
      this.form.img           = '';
      this.form.tags          = [];
      this.form.keywords      = [];
      this.form.meta_title    = '';
      this.form.meta_desc     = '';
      this.imgShow            = false;
      this.tag                = '';
      this.keywords           = '';
    },
  },

  // beforeRouteLeave (to, from , next) {
  //   // const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  //
  //   if (this.send && (this.form.title != '' || this.form.desc != '' || this.form.img != '')) {
  //     if (window.confirm('Вы действительно хотите уйти? у вас есть несохраненные изменения!')) {
  //       next()
  //     } else {
  //       next(false)
  //     }
  //   } else {
  //     next()
  //   }
  //
  // }
}
</script>

<style>

.content ul input{
  flex: 1;
  padding: 5px;
  border: none;
  outline: none;
  font-size: 16px;
}

ul.select-tags {
  border: 1px solid #cecece;
  margin-top: 5px;
  border-radius: 5px;
  padding: 11px 20px 20px 13px;
  position: absolute;
  width: 100%;
  bottom: -192px;
  right: 0;
  left: 0;
  height: 187px;
  overflow: hidden;
  overflow-y: auto;
  z-index: 99999;
  background: #fff;
}

.select-tags li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-tags li span {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  transition: all .3s ease;
  display: block;
  cursor: pointer;
}

.select-tags li span:hover {
  background: #ff3c3c;;
  color: #fff;
  transition: all .3s ease;
}

.select-tags li:not(:last-child) {
  margin-bottom: 5px;
}

.select-tags li p {
  cursor: pointer;
}

.create-new-tag {
  margin-top: 10px;
}

.tags-input .inputs {
  display: flex;

}

.tags-input .inputs i {
  font-size: 20px;
  cursor: pointer;
}

.tabs-enter-active, .tabs-leave-active {
  transition: opacity .15s;
}

.tabs-enter, .tabs-leave-to{
  opacity: 0;
}

.nav-tabs a {
  cursor: pointer;
}


.form-group.error > div.form-error {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}

.form-group.error .custom-file-label {
  border-color: #dc3545;
  background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(9.95em + 0.375rem) calc(0.75em + 0.375rem);
}

</style>

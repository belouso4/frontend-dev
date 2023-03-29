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
              <div class="card-body">
                <div class="form-group">
                  <label for="header-text">Заголовок*</label>
                  <input v-model="form.title" type="text" class="form-control" id="header-text" placeholder="Введите заголовок">
                  <p class="error-text" v-if="!validations.title.valid">{{validations.title.message}}</p>
                </div>

                <div class="form-group">
                  <label>Описание*</label>
                  <client-only>
                    <text-editor v-model="form.desc"/>
                  </client-only>
                  <p class="error-text" v-if="!validations.desc.valid">{{validations.desc.message}}</p>
                </div>

                <div class="form-group">
                  <label for="except-textarea">Небольшое описание</label>
                  <textarea v-model="form.excerpt" type="text" class="form-control" id="except-textarea" placeholder="Введите небольшое описание"></textarea>
                </div>

                <ul class="nav nav-tabs" id="custom-content-below-tab" role="tablist">
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

                <div class="form-group">
                  <!-- <label for="customFile">Custom File</label> -->
                  <label>Изображение для превью*</label>
                  <div class="custom-file">
                    <input @change="onFileChange" type="file" placeholder="Довавьте изображение"
                           class="custom-file-input"
                           id="customFile">
                    <label class="custom-file-label" for="customFile">Довавьте изображение...</label>
                    <p class="error-text" v-if="!validations.img.valid">{{validations.img.message}}</p>
                  </div>
                </div>

                <div class="form-group img">
                  <img v-if="imgShow ? true : false" :src="imgShow" alt="">
                </div>
                <div class="form-group tags-controller">
                  <label  class="label-tags">Добавить тег</label><p></p>
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
import Comments from "../../../components/admin/posts/Comments";
import Metadata from "../../../components/admin/posts/Metadata";

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

  created() {
    console.log(this.form, this.comments)
  },

  async asyncData({app, params, env, error}) {
    // try {
      const [post, comments] = await Promise.all([
        app.$api.adminPosts.edit(params.slug),
        app.$api.adminPostComments.getComments(params.slug, 0)
      ])
      const imgShow = post.img
      post.tags = post.tags ? post.tags.map(a => ({text: a.tag, id: a.id})) : []
      post.img = ''
      post.keywords = post.meta_keywords
        ? post.meta_keywords.split(',').map(a => ({text: a}))
        : []
      return {form:post, imgShow, comments}
    // }catch (err) {
    //   error({ statusCode: 404, message: 'Post not found' })
    // }

  },

  data() {
    return {
      tabShow: 'Metadata',
      loadingComments: false,
      showAnimate: true,
      tag: '',
      keywords: [],
      selectTags: '',
      send: false,
      autocompleteItems: [],
      debounce: null,
      imgShow: '',
      validations: {
        title: {
          valid: true,
          message: ''
        },
        desc: {
          valid: true,
          message: ''
        },
        img: {
          valid: true,
          message: ''
        },
      },
    }
  },

  watch:{
    'form.title':  {
      handler: function (after, before) {
        this.validations.title.valid = true
      },
      deep: true
    },
    'form.desc':  {
      handler: function (after, before) {
        this.validations.desc.valid = true
      },
      deep: true
    },
    tag() {
      this.initItems()
    }
    // slug() {
    //   this.$router.push({path: `/admin/post/${this.slug}`})
    // },
    // 'form.img': {
    //   handler: function (after, before) {
    //     console.log(this.form.img)
    //     if (this.form.img !== '') {
    //       this.imgShow = true
    //     }
    //   },
    //   deep: true
    // }
  },

  // computed: {
  //   items() {
  //     if (this.tag.length < 2) return;
  //     if(Object.keys(this.selectTags).length > 0) {
  //       return this.selectTags.filter(a => {
  //         return a.tag.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
  //       }).map(a => ({text: a.tag, id: a.id}));
  //     }
  //   },
  // },

  methods: {
    async sendBtn() {
      if (this.validation()) {
          const data = [this.formData(this.form), this.$route.params.slug]
          await this.$api.adminPosts.update(...data).then((slug) => {
            this.send = true
            this.$router.push({
              path: '/admin/posts/'+slug
            })
          })
      }
    },

    formData(data) {
      console.log(data)
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
      console.log(this.tags)
      this.autocompleteItems = [];
      this.form.tags = newTags;
    },

     initItems() {
      if (this.tag.length < 2) return;

       clearTimeout(this.debounce);
       this.debounce = setTimeout(() => {
         this.$api.adminPosts.getTags(this.tag).then(response => {
           console.log(response)
           this.autocompleteItems = response.map(a => {
             return ({text: a.tag, id: a.id});
           });
         }).catch(() => console.warn('Oh. Something went wrong'));
       }, 600);
    },

    validation() {
      let validNewPostForm = true;
      let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

      if( this.form.title == '' ){
        validNewPostForm = false;
        this.validations.title.valid = false;
        this.validations.title.message = 'Введите заголовок'
      }else{
        if( this.form.title.length < 3 ){
          validNewPostForm = false;
          this.validations.title.valid = false;
          this.validations.title.message = 'Заголовок не может быть меньше 5 символов'
        }else{
          this.validations.title.valid = true;
          this.validations.title.message = '';
        }
      }

      if( this.form.desc == '' ){
        validNewPostForm = false;
        this.validations.desc.valid = false;
        this.validations.desc.message = 'Введите описание'
      }else{
        if( this.form.desc.length < 3 ){
          validNewPostForm = false;
          this.validations.desc.valid = false;
          this.validations.desc.message = 'Описание не может быть меньше 3 символов'

        }else{
          this.validations.desc.valid = true;
          this.validations.desc.message = '';
        }
      }
      // if(this.form.img == ''){
      //   validNewPostForm = false;
      //   this.validations.img.valid = false;
      //   this.validations.img.message = 'Добавьте изображение'
      // }else{
      //   // let condition = allowedExtension.indexOf(this.form.img.type) >-1
      //   // condition = typeof this.form.img == 'string' ? true : condition
      //   console.log(allowedExtension.indexOf(this.form.img.type) >-1)
      //   if( typeof this.form.img == null || allowedExtension.indexOf(this.form.img.type) >-1){
      //     this.validations.img.valid = true;
      //     this.validations.img.message = '';
      //
      //   }else{
      //     validNewPostForm = false;
      //     this.validations.img.valid = false;
      //     this.validations.img.message = 'Поддерживаемые типы файлов - jpeg, jpg, png, gif'
      //   }
      // }

      return validNewPostForm;
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
  },
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

.error-text {
  color: red;
  margin-top: 4px;
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




/*.tab-pane.fade {*/
/*  transition: -webkit-transform .3s ease-out;*/
/*  transition: transform .3s ease-out;*/
/*  transition: transform .3s ease-out,-webkit-transform .3s ease-out;*/
/*}*/

/*.custom-model.show .modal-dialog {*/
/*  -webkit-transform: none;*/
/*  transform: none;*/
/*}*/

.tabs-enter-active, .tabs-leave-active {
  transition: opacity .15s;
}

.tabs-enter, .tabs-leave-to{
  opacity: 0;
}

.nav-tabs a {
  cursor: pointer;
}

</style>

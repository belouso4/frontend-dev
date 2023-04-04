<template>
  <div class="col-md-7">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Таблица с тегами</h3>
        <div class="card-tools d-flex align-items-center">
          <form @submit.prevent="searchTags()" class="form-search input-group input-group-sm">
            <input v-model="search"
                   @keyup="searchTags()"
                   type="text"
                   name="table_search"
                   class="form-control float-right border-dark"
                   placeholder="Поиск...">
            <div class="input-group-append">
              <button type="submit" class="btn btn-default border-dark">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="card-body table-responsive p-0" >
        <table class="table table-head-fixed text-nowrap tags-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Тег</th>
            <th>url</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="tag in tags.data">
            <td>
              <input v-model="checkbox" :value="tag.id" type="checkbox">
            </td>
            <td @dblclick="disabledTarget($event)">
              <input @keyup="editTag($event, 'tag')"
                     @blur="editTag($event, 'tag')"
                     type="text" :value="tag.tag"
                     :data-id="tag.id" disabled>
              <div class="tag-ui">
                <i class="fa-solid fa-check"></i>
                <Loader/>
              </div>
            </td>
            <td @dblclick="disabledTarget($event)">
              <input @keyup="editTag($event, 'slug')"
                     @blur="editTag($event, 'slug')"
                     type="text" :value="tag.slug"
                     :data-id="tag.id" disabled>
              <div class="tag-ui-last">
                <i class="fa-solid fa-check"></i>
                <Loader/>
              </div>
            </td>
          </tr>
          </tbody>
          <div v-if="loading" class="spinner-load">
            <Loader/>
          </div>
        </table>
      </div>
      <div class="card-footer d-flex">
        <button @click="deleteTag()" type="submit"
                class="btn btn-default delete-btn"
                :disabled="checkbox.length ? false : true">
          Удалить
        </button>
        <pagination :data="tags" @pagination-change-page="getTags"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "TagTable",

  data() {
    return {
      tagsEdit: '',
      urlTagsEdit: '',
      checkbox: [],
      cache: '',
      currentUi: null,
      status: null,
      currentTagUpdate: null,
      search: ''
    }
  },

  computed: {
    ...mapGetters({
      tags: 'tags/getTags',
      loading: 'tags/loading'
    })
  },

  methods: {
      getTags(page = 1) {
      if (this.search === '') return this.$store
        .dispatch('tags/fetchTags', page)

      this.$store.dispatch('tags/searchTags', {
        page: page,
        search: this.search,
      })
    },

    disabledTarget(e) {
      if (e.target.tagName !== 'INPUT') return false

      if(this.status !== true) {
        if (this.currentUi) {
          this.currentUi.lastChild.style.display = 'none'
          this.currentUi.firstChild.style.display = 'none'
        }

        this.cache = e.target.value.trim()

        e.target.disabled=0
        e.target.focus()
      }
    },

     editTag(e, input) {
      if(e.key == "Enter"){
        e.target.disabled = 'disabled'

      } else if(e.key && e.key !== "Enter") {
        if (this.currentUi) {
          this.currentUi.lastChild.style.display = 'none'
          this.currentUi.firstChild.style.display = 'none'
        }

        e.target.disabled=0
      } else {
        e.target.disabled='disabled'

        let elem = e.target.value.trim()
        let idTag = Number(e.target.getAttribute('data-id'))

        let currentTagUpdateName = this.currentTagUpdate == null
          ? null : this.currentTagUpdate.tag
        let currentTagUpdateSlug = this.currentTagUpdate == null
          ? null : this.currentTagUpdate.slug

        this.tags.data.forEach((tag) => {
          if (tag.id === idTag) {
            if (tag.tag === elem || currentTagUpdateName === elem) return false
            if (tag.slug === elem || currentTagUpdateSlug === elem) return false

            if (this.validationEdit(elem)) {
              let loader = e.target.nextSibling.nextSibling.lastChild
              loader.style.display = 'block'

              this.$api.adminTags.update(idTag,{[input]: elem})
                .then(async (res) => {
                  console.log(res)
                  this.$store.commit('tags/updateTag', res)
                  this.statusTag()
                })
                .catch(res => {
                  console.log('ergergerg', res)
                  e.target.value = this.cache
                })

              this.currentUi = e.target.nextSibling.nextSibling
            } else {
              e.target.value = this.cache
            }
          }
        })
      }
    },

    async deleteTag() {
      if(this.checkbox.length > 0) {
        this.$store.commit('tags/setLoading', true)

        await this.$api.adminTags.delete(this.checkbox.join(','))
        await this.getTags()
        this.checkbox = []
      }
    },

    statusTag() {
      this.currentUi.lastChild.style.display = 'none'
      this.currentUi.firstChild.style.display = 'block'

      setTimeout(() => {
        this.currentUi.firstChild.style.display = 'none'
      },3000)
    },

    validationEdit(tag) {
      if( tag === '' ) return false
      if (tag.length > 50) return false

      return true;
    },

    searchTags() {
      if(this.search && this.search.length >= 2) {
          clearTimeout(this.debounce);
          this.$store.commit('tags/setLoading')

          this.debounce = setTimeout(() => {
            this.$store.dispatch('tags/searchTags', {
              page: 1,
              search: this.search,
            }).then(response => {
              console.log(response)
            }).catch(() => {
              console.warn('Oh. Something went wrong')
            }).finally(() => {
            });
          }, 600);
      } else {
        if (this.search === "") this.getTags()
      }
    }
  }
}
</script>

<style scoped>

.tags-table td {
  position: relative;
}

.tags-table .tag-ui {
  position: absolute;
  width: 15px;
  top: 50%;
  transform: translateY(-50%);
  right: 19px;

}

.tags-table .tag-ui img, .tags-table .tag-ui-last img {
  height: auto;
  -o-object-fit: contain;
  object-fit: contain;
  width: 100%;
  margin: 0 auto;
}

.tags-table .tag-ui-last {
  position: absolute;
  width: 15px;
  top: 50%;
  transform: translateY(-50%);
  right: 31px;
}

.tags-table .tag-ui i, .tags-table .tag-ui-last {
  color: #14a727;
}

.tags-table .tag-ui-last > *, .tags-table .tag-ui > * {
  display: none;
}

.tags-table input {
  width: 100%;
  vertical-align: sub;
}

.delete-btn {
  margin-right: 19px;
}

.spinner-load {
  position: absolute;
  z-index: 10;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #00000033;
}

.spinner-load img{
 width: 36px;
}

tbody tr td:first-child {   width: 4%; }
</style>

<template>
  <modal :show="$store.getters['ui/getSearchModal']"
         @close-modal="closeModal"
         :size="'margin-lg'"
         :bg="'bg-secondary'">
    <template>
      <div v-if="loading" class="overlay">
        <i class="fas fa-2x fa-sync fa-spin"></i>
      </div>
      <div class="modal-body">
        <ais-instant-search :search-client="searchClientMeiliSearch"  index-name="admin_global">
          <ais-configure :attributesToSnippet="['title:7','desc:15']"
                         snippetEllipsisText="…"
                         :hits-per-page.camel="4"/>
          <ais-autocomplete>
            <div slot-scope="{ currentRefinement, indices, refine, result }" class="md:relative">
                <input
                  type="search"
                  ref="searchInput"
                  class="form-control form-control-lg"
                  :value="currentRefinement"
                  @input="refine($event.currentTarget.value)"
                  placeholder="Поиск..."
                  show-loading-indicator
                  autocomplete="off"
                >

              <template v-if="currentRefinement">

                <ais-hits>
                  <div slot="item" slot-scope="{ item }" @click="pathPush(item)">
                        <h5>{{checkPost(item.modelId) ? 'Посты' : 'Пользователи'}}</h5>
                        <div  class="search-elements d-flex align-items-center" >
                            <div class="search-img">
                              <img :src="checkPost(item.modelId) ? item.img : item.avatar" alt="">
                            </div>

                          <div v-if="!checkPost(item.modelId)" class="d-flex flex-column">
                            <ais-highlight attribute="name" :hit="item" />
                            <ais-highlight attribute="email" :hit="item" />
                          </div>
                            <div v-else class="d-flex flex-column">
                              <ais-snippet :hit="item" attribute="title" />
                              <ais-snippet :hit="item" attribute="desc"/>
                            </div>

                        </div>
                      </div>
                </ais-hits>
<!--                <ais-pagination />-->
              </template>


              </div>
          </ais-autocomplete>
        </ais-instant-search>

<!--        <form @submit.prevent="searchData()" class="w-100 mb-3">-->
<!--          <div class="input-group">-->
<!--            <div class="input-group-prepend">-->
<!--              <span class="input-group-text">-->
<!--                <i v-if="!loading" class="fa fa-search"></i>-->
<!--                <Loader v-else/>-->
<!--              </span>-->
<!--            </div>-->
<!--            <input ref="searchInput" v-model.trim="search" @keyup="searchData()"-->
<!--                   type="search" class="form-control form-control-lg" placeholder="Введите ключевые слова здесь">-->
<!--          </div>-->
<!--        </form>-->
<!--        <div v-if="search !== '' && Object.keys(data).length">-->
<!--          <div v-for="(items, key) in data">-->
<!--            <h5>{{key === 'posts' ? 'Посты' : 'Пользователи'}}</h5>-->
<!--            <ul class="custom-list">-->
<!--              <li v-for="item in items" class="d-flex align-items-center" @click="pathPush(key, item.id)">-->
<!--                <span>-->
<!--                  <div class="avatar">-->
<!--                    <img :src="$config.API_URL_IMG + '/' +item.img" alt="">-->
<!--                  </div>-->
<!--                </span>-->
<!--                  <div v-if="key === 'users'" class="d-flex flex-column">-->
<!--                    <span>{{item.title}}</span>-->
<!--                    <span>{{item.email}}</span>-->
<!--                  </div>-->
<!--                  <span v-else>{{item.title}}</span>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div v-else class="start-screen">{{notResult}}</div>-->
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from "../global/Modal";
import { createServerRootMixin } from 'vue-instantsearch'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { MeiliSearch } from 'meilisearch'

import 'instantsearch.css/themes/satellite-min.css'

export default {
  name: "UsersListModal",
  components: {Modal},

  // mixins: [
  //   createServerRootMixin({
  //     searchClient,
  //     indexName: 'admin_main_search',
  //   }),
  // ],

  data() {
    return {
      loading: false,
      search: "",
      debounce: null,
      data: {},
      notResult: 'Нет недавних поисков',
      searchClientMeiliSearch: instantMeiliSearch(
        process.env.MEILISEARCH_HOST,
        process.env.MEILISEARCH_KEY,
      ),
    }
  },

  async created() {
    const client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_KEY,
    })
    // console.log('this.instantMeiliSearch', await client.index('posts').search('499'))
    // admin_main_search
    // console.log('this.instantMeiliSearch', await client.multiSearch({queries: [
    //     {
    //       indexUid: 'posts',
    //       q: 'alice',
    //       limit: 5,
    //     },
    //     {
    //       indexUid: 'users',
    //       q: 'jh',
    //     },
    //   ]})
    // )
  },

  watch: {
    '$store.state.ui.searchModal': function (value) {
      if (value) {
        var self = this;
        setTimeout(() => {self.$refs.searchInput.focus()},100)
      }
    }
  },

  methods: {
    closeModal() {
      this.$store.commit('ui/setSearchModal', false)
      this.search = ''
      this.data = {}
    },

    pathPush(item) {
      this.loading = true

      const page = this.checkPost(item.modelId)
        ? ['posts', item.slug]
        : ['users', item.id]

      let path = '/admin/'+page[0]+'/'+page[1];
      this.$router.push({path: path})

      this.closeModal()
      this.loading = false
    },

    searchData() {
        if (this.search && this.search.length >= 2) {
          this.loading = true
          clearTimeout(this.debounce);

          this.debounce = setTimeout(async () => {
            if(!this.search) return this.loading = false

            try {
              let response = await this.$api.adminGeneral.search({search: this.search})

              if (!Object.keys(response).length) this.notResult = 'Нет результатов для "'+this.search+'"'
              this.data = response ?? {}
            } catch (err) {console.log(err)}

            this.loading = false
          }, 400);
        } else {
          this.notResult = 'Нет недавних поисков'
          this.data = {}
        }
    },

    checkPost(data) {
      return data.split('_')[0] === 'post'
    }

  },
}
</script>

<style>
li.ais-Hits-item {
  background: transparent;
  display: block;
}

li.ais-Hits-item:not(:last-child) {
  margin-bottom: 10px;
}

.ais-Hits-list li {
  margin: 7px 0;
  cursor: pointer;
  color: #fff;
  border: 1px solid transparent;
  padding: 10px;
  border-radius: 0.25rem;
  background: rgb(255 255 255 / 17%);
  width: 100%;
}

.ais-Hits-list li:hover {
  background: rgb(255 255 255 / 25%);
}

.ais-Hits-list li > span:not(:last-child) {
  margin-right: 10px;
}

.ais-Hits-list .search-img {
  border: 1px solid #cecece;
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  background: #fff;
  margin-right: 10px;
}
.ais-Hits-list .search-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ais-Highlight-highlighted, .ais-Snippet-highlighted {
  background-color: #959595;
  color: #ffffff;
  padding: 0;
  font-weight: bold;
  /*background-color: transparent;*/
  /*color: #ffffff;*/
  /*padding: 0;*/
  /*border-bottom: 1px solid #fff;*/
}

.search-elements {
  gap: 10px;
}

</style>

<style scoped>
  .limit-height {
    /*max-height: 500px;*/
    /*height: 100%;*/
    height: 400px;
  }

  .input-group-text {
    padding: 0 18px;
  }


  [type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    height: 10px;
    width: 10px;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjEyMy4wNXB4IiBoZWlnaHQ9IjEyMy4wNXB4IiB2aWV3Qm94PSIwIDAgMTIzLjA1IDEyMy4wNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTIzLjA1IDEyMy4wNTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTEyMS4zMjUsMTAuOTI1bC04LjUtOC4zOTljLTIuMy0yLjMtNi4xLTIuMy04LjUsMGwtNDIuNCw0Mi4zOTlMMTguNzI2LDEuNzI2Yy0yLjMwMS0yLjMwMS02LjEwMS0yLjMwMS04LjUsMGwtOC41LDguNQ0KCQljLTIuMzAxLDIuMy0yLjMwMSw2LjEsMCw4LjVsNDMuMSw0My4xbC00Mi4zLDQyLjVjLTIuMywyLjMtMi4zLDYuMSwwLDguNWw4LjUsOC41YzIuMywyLjMsNi4xLDIuMyw4LjUsMGw0Mi4zOTktNDIuNGw0Mi40LDQyLjQNCgkJYzIuMywyLjMsNi4xLDIuMyw4LjUsMGw4LjUtOC41YzIuMy0yLjMsMi4zLTYuMSwwLTguNWwtNDIuNS00Mi40bDQyLjQtNDIuMzk5QzEyMy42MjUsMTcuMTI1LDEyMy42MjUsMTMuMzI1LDEyMS4zMjUsMTAuOTI1eiIvPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=);
    background-size: 10px 10px;
  }

  .start-screen {
    margin: 0 auto;
    padding: 36px 0;
    text-align: center;
  }

  .input-group-prepend img {
    width: 16px;
  }
</style>


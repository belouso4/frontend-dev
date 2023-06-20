<template>
  <div id="app-layout">

    <div>
      <AppHeader v-show="showHeader"/>
    </div>

    <section v-if="showSidebar" class="section-posts">
      <div class="container">
        <div class="main-header">
          <h1 v-if="title_main">{{ title_main }}</h1>
          <Breadcrumbs/>
        </div>
        <div class="flex-position">
          <aside>
            <div class="aside-title">
              Теги
            </div>
            <div class="tags">
              <nuxt-link v-for="tag in tags" :key="tag.slug+'-'+tag.id" :to="'/tag/'+tag.slug">
                {{ tag.tag }}
              </nuxt-link>
              <a v-if="$store.state.tags.page !== null" @click.prevent="$fetch" class="cursor-pointer">
                <Loader width="12px" v-if="$fetchState.pending"/>
                <span v-else>...</span>
              </a>
            </div>
          </aside>
          <nuxt keep-alive :nuxt-child-key="'someKey-' + $route.fullPath"/>
        </div>
      </div>
    </section>

    <nuxt v-else />

    <AppFooter v-show="showFooter"/>

  </div>
</template>

<script>
    import AppFooter from "../components/global/AppFooter";
    import AppHeader from "../components/global/AppHeader";
    import {mapGetters} from "vuex";

    export default {
      components: {AppHeader, AppFooter},

      async fetch() {
        return await this.$store.dispatch('tags/fetchTags')
      },

      computed: {
        showFooter(){
            let pages = [];
            return pages.indexOf( this.$route.name ) === -1;
        },

        showHeader(){
            let pages = [];
            return pages.indexOf( this.$route.name ) === -1;
        },

        showSidebar(){
            let pages = [
              'category',
              'category-subCategory',
              'category-subCategory-article-slug',
              'category-article-slug',
              'tag-slug',
            ];

            return pages.indexOf( this.$route.name ) != -1;
        },

        ...mapGetters({
          categories: 'core/getCategories',
          tags: 'tags/getTags',
          title_main: 'core/getTitle',
        })
      },
    }
</script>

<style scoped>
  #app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

</style>

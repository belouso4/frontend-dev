<template>
  <section class="main-section">
    <div class="container">

      <div class="wrapper-post">

        <client-only>
          <SliderMain :sliders="sliders"/>
          <div class="slider-skeleton" slot="placeholder">
            <div class="published-skeleton"><span class="skeleton"></span></div>
            <div class="desc-skeleton">
              <span class="skeleton"></span>
              <span class="skeleton"></span>
              <span class="skeleton"></span>
              <span class="skeleton"></span>
            </div>
          </div>
        </client-only>
      </div>
      <div class="section-list section-latest-articles">
        <div class="latest-articles--header">
          <h2>Самые просматриваемые статьи</h2>
          <nuxt-link to="/articles">
            Показать все <i class="fas fa-chevron-right"></i>
          </nuxt-link>
        </div>
        <div class="latest-articles">
          <template v-if="popularPosts.length">
            <div v-for="item in popularPosts" class="latest-article">
              <div>
                <p>
                  <nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
                </p>
                <p>
                  <nuxt-link :to="item.category_url">{{ item.category_name }}</nuxt-link>
                </p>
              </div>
              <p>{{ item.created_at }}</p>
            </div>
          </template>
          <template v-else>
            <div class="post-item-line-skeleton" v-for="item in 4">
              <div>
                <span class="skeleton"></span>
                <span class="skeleton"></span>
              </div>
              <span class="skeleton"></span>
            </div>
          </template>

        </div>
      </div>

      <div class="section-list section-featured">
        <div class="featured-header">
          <h2>Избранные статьи</h2>
          <nuxt-link to="/articles">
            Показать все <i class="fas fa-chevron-right"></i>
          </nuxt-link>
        </div>

        <div v-if="randomPosts.length" class="featured">
          <div v-for="item in randomPosts" class="featured-item">
            <nuxt-link :to="item.category_url">{{ item.category_name }}</nuxt-link>

            <h3><nuxt-link :to="item.url">{{ item.title }}</nuxt-link></h3>

            <!--            <p>WebGL позволяет веб-контенту использовать API, основанный на OpenGL ES 2.0, для визуализации -->
            <!--              трёхмерной графики без , основанный на OpenGL ES 2.0, для визуализации трёхмерной графики efwefweff ergegrerggerg</p>-->
            <p>{{ item.excerpt }}</p>
          </div>
        </div>

        <div v-else class="post-item-block-skeleton-wrapp">
          <div class="post-item-block-skeleton" v-for="item in 4">
            <span class="skeleton"></span>
            <span class="skeleton"></span>

            <div>
              <span class="skeleton"></span>
              <span class="skeleton"></span>
              <span class="skeleton"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="section-list section-latest-articles">
        <div class="latest-articles--header">
          <h2>Последние статьи</h2>
          <nuxt-link to="/articles">
            Показать все <i class="fas fa-chevron-right"></i>
          </nuxt-link>
        </div>
        <div class="latest-articles grey">
          <template v-if="lastPosts.length">
            <div v-for="item in lastPosts" class="latest-article">
              <div>
                <p>
                  <nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
                </p>
                <p>
                  <nuxt-link :to="item.category_url">{{ item.category_name }}</nuxt-link>
                </p>
              </div>
              <p>{{ item.created_at }}</p>
            </div>
          </template>
          <template v-else>
            <div class="post-item-line-skeleton" v-for="item in 4">
              <div>
                <span class="skeleton"></span>
                <span class="skeleton"></span>
              </div>
              <span class="skeleton"></span>
            </div>
          </template>
        </div>
      </div>


    </div>
  </section>
</template>

<script>
import SliderMain from "../components/SliderMain";
export default {
  name: 'index',
  components: {SliderMain},
  layout: 'AppMain',

  data() {
    return {
      lastPosts: [],
      popularPosts: [],
      randomPosts: [],
      sliders: [],
    };
  },

  async fetch() {
    this.sliders = await this.$api.other.index()
    this.lastPosts = await this.$api.other.posts(7,'created_at')
    this.popularPosts = await this.$api.other.posts(4,'viewed')
    this.randomPosts = await this.$api.other.posts(4,'random')
  },

  computed: {
    checkComponent() {
      return process.client && this.sliders.length
    }
  },

}
</script>

<style>

.post-item-block-skeleton-wrapp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}

.post-item-block-skeleton {
  padding: 14px;
  background: #cecece;
  border-radius: 7px;
}

.post-item-block-skeleton span {
  background: #e7e7e7;
  border-radius: 7px;
  height: 21px;
  display: block;
  width: 85px;
}

.post-item-block-skeleton > span:first-child {
  height: 17px;
  margin-bottom: 13px;
}

.post-item-block-skeleton > span:nth-of-type(2) {
  width: 65%;
}

.post-item-block-skeleton div {
  margin-top: 25px;
}

.post-item-block-skeleton div > span {
  width: 100%;
  height: 16px;
}

.post-item-block-skeleton div > span:not(:last-child) {
  margin-bottom: 11px;
}

.post-item-block-skeleton div > span:last-child {
  width: 50%;
}

.post-item-line-skeleton {
  padding: 14px;
  width: 100%;
  background: #cecece;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.post-item-line-skeleton:not(:last-child) {
  margin-bottom: 30px;
}

.post-item-line-skeleton span{
  background: #e7e7e7;
  border-radius: 7px;
  height: 15px;
  display: block;
  width: 85px;
}

.post-item-line-skeleton > div span:first-child {
  height: 18px;
  width: 300px;
  margin-bottom: 10px;
}


.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
}

.slider-skeleton {
  height: 345px;
  background-color: #cecece;
  border-radius: 7px;
  position: relative;
}

.slider-skeleton .published-skeleton {
  width: 25%;
  background: #cecece;
  position: absolute;
  left: 11px;
  top: 11px;
  border-radius: 7px;
  padding: 14px;
}

.slider-skeleton .published-skeleton span {
  background: #cecece;
  border-radius: 7px;
  height: 15px;
  display: block;
}

.slider-skeleton .desc-skeleton {
  width: 50%;
  background: #c7c7c7;
  position: absolute;
  right: 11px;
  bottom: 11px;
  padding: 20px;
  border-radius: 7px;
}

.slider-skeleton .desc-skeleton > span {
  background: #cecece;
  border-radius: 7px;
  height: 15px;
  display: block;
}

.slider-skeleton .desc-skeleton > span:not(:last-child) {
  margin-bottom: 7px;
}

.slider-skeleton .desc-skeleton > span:first-child {
  width: 100%;
  margin-bottom: 14px;
  height: 19px;
}

.slider-skeleton .desc-skeleton > span:last-child {
  width: 70%;
}

@keyframes skeleton-loading {
  0% {
    background-color: #c2cfd6;
  }
  100% {
    background-color: #f0f3f5;
  }
}

/*@keyframes skeleton-loading {*/
/*  0% {*/
/*    background-color: hsl(200, 20%, 80%);*/
/*  }*/
/*  100% {*/
/*    background-color: hsl(200, 20%, 95%);*/
/*  }*/
/*}*/
</style>

<style scoped>



.slider-wrapper .slide-arrow{
  position: absolute;
  background: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  z-index: 10;
  top: 50%;
  text-align: center;
  line-height: 50px;
  transform: translateY(-50%);
  transition: all .3s ease;
  cursor: pointer;
  user-select: none;
  font-size: 25px;
}
.slider-wrapper .slide-arrow:hover{
  opacity: 0.5;
}
.slider-wrapper .slide-arrow.prev{
  left: -69px;
}
.slider-wrapper .slide-arrow.next{
  right: -69px;
}


.section-list > div:first-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 27px;
}

.featured {
  display: flex;
  flex-wrap: wrap;
}

.featured-item {
  width: calc(50% - 10px);
  border: 1px solid;
  border-radius: 7px;
  padding: 17px;
  transition: all .3s ease;
}

.featured-item:hover {
  -webkit-box-shadow: 7px 9px 29px -8px rgba(0,0,0,0.75);
  -moz-box-shadow: 7px 9px 29px -8px rgba(0,0,0,0.75);
  box-shadow: 7px 9px 29px -8px rgba(0,0,0,0.75);
}

.featured-item:not(:nth-last-child(-n + 2)) {
  margin-bottom: 20px;
}

.featured-item:not(:nth-child(2n)) {
  margin-right: 20px;
}

.featured-item a:hover {
  border-bottom: 1px solid black;
  text-decoration: none;
}
.featured-item h3 {
  margin: 11px 0 20px;
}
.featured-item p {
  line-height: 22px;
}

.featured-item p {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to show */
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

.latest-article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-radius: 7px;
  transition: all .3s ease;

  -webkit-box-shadow: 7px 9px 29px -14px rgba(0,0,0,0.75);
  -moz-box-shadow: 7px 9px 29px -14px rgba(0,0,0,0.75);
  box-shadow: 7px 9px 29px -14px rgba(0,0,0,0.75);
}

.latest-article:not(:last-child) {
  margin-bottom: 30px
}

/*.latest-article:hover {*/
/*  -webkit-box-shadow: 7px 9px 29px -14px rgba(0,0,0,0.75);*/
/*  -moz-box-shadow: 7px 9px 29px -14px rgba(0,0,0,0.75);*/
/*  box-shadow: 7px 9px 29px -14px rgba(0,0,0,0.75);*/
/*}*/

.latest-article:not(:nth-child(2n)) {
  background: azure;
}

.grey .latest-article:not(:nth-child(2n)) {
  background: #d6d6d6;
}

.latest-article > div:first-child p:last-child {
  font-size: 14px;
  margin-top: 8px;
}


@media screen  and (max-width: 992px){
  .main-slider .slide-description {
    width: 100%;
    bottom: 0;
    right: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 15px;
  }
  .main-slider .slide-description p {
    font-size: 13px;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .main-slider .slide-published {
    font-size: 12px;
    top: 0;
    padding: 15px;
    left: 0;
  }

  .featured-item {
    margin-right: 0;
    width: 100%;
  }

  .featured-item:not(:nth-child(2n)) {
    margin-right: 0;
  }

  .featured-item:not(:nth-last-child(-n + 2)) {
    margin-bottom: 0;
  }


  .featured-item:not(:last-child) {
    margin-bottom: 20px;
  }

  .slider-skeleton .published-skeleton {
    left: 7px;
    top: 7px;
    padding: 11px;
  }

  .slider-skeleton .desc-skeleton {
    width: 100%;
    right: 0;
    bottom: 0;
    padding: 15px;
  }

  .post-item-block-skeleton-wrapp {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
}

/* 576px-768px */
@media screen and (max-width: 768px) {

}

/*320px-576px*/
@media screen and (max-width: 576px) {


}
</style>

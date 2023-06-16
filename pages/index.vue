<template>
  <section class="main-section">
    <div class="container">

      <div class="wrapper-post">

          <SliderMain :sliders="sliders"/>

<!--        <div class="slider-wrapper">-->
<!--          <div @click="prev" class="slide-arrow prev"> < </div>-->
<!--          <client-only>-->
<!--            <slick ref="slick" :options="slickOptions">-->
<!--              <div v-for="item in 3">-->
<!--                <div class="news-item">-->
<!--                  <div class="img-news">-->
<!--                    <img :src="$config.API_URL_IMG +'/300x200.png'" alt="">-->
<!--                  </div>-->
<!--                  <div class="news-item-area">-->
<!--                    <h3 class="news-item-area_title">-->
<!--                      Что ждет Афганистан после возвращения под-->
<!--                      власть талибов-->
<!--                    </h3>-->
<!--                    <p class="news-item-area_desc">-->
<!--                      После того как «Талибан» захватил почти всю-->
<!--                      территорию Афганистана, президент бежал из-->
<!--                      страны, его дворец захватили талибы. Какие-->
<!--                      ошибки допустили власти Афганистана и чего-->
<!--                      ждать от возвращения «Талибана», разбирался-->
<!--                      РБК-->
<!--                    </p>-->
<!--                    <div class="news-item-area_elem">-->
<!--                      <p>23 477 <i class="far fa-eye"></i></p>-->
<!--                      <a href=""><i class="fas fa-share"></i></a>-->
<!--                      <a href="" class="like active"><i class="far fa-heart"></i></a>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </slick>-->
<!--          </client-only>-->
<!--          <div @click="next" class="slide-arrow next"> > </div>-->
<!--        </div>-->
      </div>

      <div class="section-list section-featured">
        <div class="featured-header">
          <h2>Избранные статьи</h2>
          <nuxt-link to="/">
            Показать все <i class="fas fa-chevron-right"></i>
          </nuxt-link>
        </div>
        <div class="featured">
          <div v-for="item in 4" class="featured-item">
            <nuxt-link to="/">Процессоры</nuxt-link>

              <h3><nuxt-link to="/">Процессор интел 10</nuxt-link></h3>

            <p>WebGL позволяет веб-контенту использовать API, основанный на OpenGL ES 2.0, для визуализации трёхмерной графики без , основанный на OpenGL ES 2.0, для визуализации трёхмерной графики efwefweff ergegrerggerg</p>
          </div>
        </div>
      </div>

      <div class="section-list section-latest-articles">
        <div class="latest-articles--header">
          <h2>Самые просматриваемые статьи</h2>
          <nuxt-link to="/">
            Показать все <i class="fas fa-chevron-right"></i>
          </nuxt-link>
        </div>
        <div class="latest-articles">
          <div v-for="item in 4" class="latest-article">
            <div>
              <p>
                <nuxt-link to="">WebGL позволяет веб-контенту использовать API,</nuxt-link>
              </p>
              <p>
                <nuxt-link to="/">Процессоры</nuxt-link>
              </p>
            </div>
            <p>2 месяца назад</p>
          </div>
        </div>
      </div>

      <div class="section-list section-latest-articles">
        <div class="latest-articles--header">
          <h2>Последние статьи</h2>
          <nuxt-link to="/">
            Показать все <i class="fas fa-chevron-right"></i>
          </nuxt-link>
        </div>
        <div class="latest-articles grey">
          <div v-for="item in 7" class="latest-article">
            <div>
              <p>
                <nuxt-link to="">WebGL позволяет веб-контенту использовать API,</nuxt-link>
              </p>
              <p>
                <nuxt-link to="/">Процессоры</nuxt-link>
              </p>
            </div>
            <p>2 месяца назад</p>
          </div>
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

  async asyncData({app}) {
    try {
      const sliders = await app.$api.other.index()
      return {sliders}
    } catch (err) {console.log(err)}
  },

  data() {
    return {

    };
  },


  methods: {
    // next() {
    //   this.$refs.slick.next();
    // },
    //
    // prev() {
    //   this.$refs.slick.prev();
    // },
  },


}
</script>

<style>

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
  width: calc(50% - 15px);
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
  margin-right: 30px;
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
</style>

<template>
    <client-only  placeholder="Loading...">

          <agile :infinite="true">
<!--            <div class="slide">1</div>-->
<!--            <div class="slide">1</div>-->
<!--            <div class="slide">1</div>-->
<!--            <div class="slide">1</div>-->
                <div v-for="slider in sliders"
                    :key="slider.id"
                    @click="hello"
                    class="news-item slide"
                  >
                  <div class="wrap-slide">
                    <div class="img-news">
                      <img :src="slider.img" alt="">
                    </div>
                    <div class="news-item-area">
                      <h3 class="news-item-area_title">
                        {{ slider.title }}
                      </h3>
                      <p class="news-item-area_desc">
                        {{slider.excerpt}}
                      </p>
                    </div>
                  </div>
                </div>
            <template slot="prevButton"><i class="fas fa-chevron-left"></i></template>
            <template slot="nextButton"> <i class="fas fa-chevron-right"></i> </template>
          </agile>
    </client-only>


</template>

<script>
// import { VueAgile } from 'vue-agile'
export default {
  name: "SliderMain",
  props: ['sliders'],
  // components: {
  //   agile: VueAgile
  // },
  data() {
    return {

    }
  },
  created() {
    console.log(this.sliders)
  },

  methods: {
    hello($event) {
      console.log(`hello index: ${$event}`)
    },
  },

}
</script>

<style scoped>
.news-item {
  height: auto;
  margin-bottom: 0px;
}

.img-news {
  height: 345px;
}

.slider-wrapper {
  position: relative;
}
</style>

<style>

.agile {

}

.agile .wrap-slide {
display: flex;
}
.agile .agile__nav-button {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 24px;
  height: 100%;
  position: absolute;
  top: 0;
  transition-duration: .3s;
  width: 80px;

}
.agile .agile__nav-button:hover {
  background-color: rgba(#000, .5);
  opacity: 1;

}
.agile .agile__nav-button--prev {
  left: 0
}

.agile .agile__nav-button--next {
  right: 0
}

</style>

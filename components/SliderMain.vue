<template>
  <slider :autoplay="false" animation="fade">
    <slider-item
      v-for="slider in sliders"
      :key="slider.id"
      @click="hello"
      class="news-item"
    >


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
          <div class="news-item-area_elem">
            <p>23 477 <i class="far fa-eye"></i></p>
            <a href=""><i class="fas fa-share"></i></a>
            <a href="" class="like active"><i class="far fa-heart"></i></a>
          </div>
        </div>


    </slider-item>
  </slider>
</template>

<script>
import { Slider, SliderItem } from 'vue-easy-slider'

export default {
  components: {
    Slider,
    SliderItem,
  },
  name: "SliderMain",

  props: ['sliders'],

  data() {
    return {
      // list: [
      //   { width: '100%', height: '100%' },
      //   { width: '100%', height: '100%' },
      //   { width: '100%', height: '100%' },
      // ],
    }
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

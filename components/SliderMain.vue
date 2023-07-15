<template>
    <agile v-if="sliders.length" :infinite="true">
      <div v-for="slider in sliders"
           :key="'slider-'+slider.id"
           class="main-slider slide"
      >
        <div class="wrap-slide">
          <div class="image-container">
            <img :src="slider.img">
          </div>
          <div class="blur-overlay slide-description">
            <h3>
              {{ slider.title }}
            </h3>
            <p>
              {{ slider.excerpt }}
            </p>

          </div>
          <div class="blur-overlay slide-published">
            published about 1 hour ago
          </div>
        </div>
      </div>

      <template slot="prevButton"><i class="fas fa-chevron-left"></i></template>
      <template slot="nextButton"> <i class="fas fa-chevron-right"></i> </template>
    </agile>

    <div v-else class="slider-skeleton">
      <div class="published-skeleton"><span class="skeleton"></span></div>
      <div class="desc-skeleton">
        <span class="skeleton"></span>
        <span class="skeleton"></span>
        <span class="skeleton"></span>
        <span class="skeleton"></span>
      </div>
    </div>


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

}
</script>

<style scoped>
.main-slider {
  border-radius: 7px;
  overflow: hidden;
}
.wrap-slide {
  position: relative;
}

.image-container {
  width: 100%;
}

.wrap-slide img {
  width: 100%;
  height: 345px;
  object-fit: cover;
}

.blur-overlay {
  border-radius: 7px;
  position: absolute;
  color: #fff;
  backdrop-filter: blur(10px); /* Размытие */
  background-color: rgb(0 0 0 / 50%); /* Прозрачный фон */
}

.slide-description{
  right: 11px;
  bottom: 11px;
  padding: 20px;
  width: 70%;
}

.slide-published{
  position: absolute;
  left: 11px;
  top: 11px;
  padding: 20px;
}

.blur-overlay h3 {
  margin-bottom: 11px;
}

.blur-overlay p {
  line-height: 20px;
}

.slider-wrapper {
  position: relative;
}

</style>

<style>

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

@media screen  and (max-width: 992px) {
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
}

</style>

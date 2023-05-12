<template>
  <div class="card">
    <div class="card-header border-bottom-0">
      <h3>Главный слайдер</h3>
    </div>

    <div class="card-body p-0">
      <div class="row">
        <div class="col-md-6">

          <PostsSection/>

        </div>
        <div class="col-md-6">

          <client-only>
            <list-slider/>
          </client-only>

        </div>
      </div>
    </div>
    <!-- /.card-body -->
    <div class="card-footer note-float d-flex align-items-center justify-content-between">

    </div>
  </div>
</template>

<script>
import listSlider from "./ListSlider.vue";
import PostsSection from "./PostsSection.vue";

export default {
  name: "SliderSection",
  components: {PostsSection, listSlider},
}
</script>

<style scoped>

</style>

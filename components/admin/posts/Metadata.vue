<template>
  <div>
    <h2 class="mb-4 mt-3">Метаданные</h2>
    <div class="form-group">
      <label for="meta-keywords">Заглавие</label>
      <input :value="metaTitle"
             @input="$emit('update:meta-title', $event.target.value)"
             type="text" class="form-control"
             id="meta-keywords"
             placeholder="Введите заголовок">
    </div>
    <div class="form-group">
      <label for="meta-desc">Описание</label>
      <textarea :value="metaDesc"
                @input="$emit('update:meta-desc', $event.target.value)"
                type="text" class="form-control"
                id="meta-desc"
                placeholder="Введите описание">
      </textarea>
    </div>
    <div class="form-group">
      <label for="meta-keywords">Ключевые слова (Ввод + Enter)</label>
      <client-only>
        <vue-tags-input
          placeholder="важные, ключевые, слова"
          v-model="keywords"
          :tags="metaKeywords"
          class="tags-input"
          @tags-changed="newTags => $emit('update:meta-keywords', newTags)"/>
      </client-only>
    </div>
  </div>
</template>
<script>
export default {
  name: "Metadata",
  props: ['metaDesc', 'metaTitle', 'metaKeywords'],
  data() {
    return {
      keywords: '',
    }
  }

}
</script>

<style scoped>

</style>

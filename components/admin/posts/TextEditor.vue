<template>
  <quill-editor
    ref="editor"
    :options="editorOption"
    :value="value"
    @change="onEditorChange"
  />
</template>

<script>
export default {
  name: "TextEditor",
  props: ['value'],

  data() {
    return {
      editor: null,
      editorOption: {
        placeholder: 'Введите описание...',
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['clean'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': ['#343434'] }, { 'background': ["#445678"] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video']
          ],
        },
      },
    }
  },

  methods: {
    onEditorChange(value) {
      this.$emit('input', value.html)
    },
  },

  // computed: {
  //   editor() {
  //     return this.$refs.editor.quill
  //   },
  // }

}
</script>

<style>
 .form-group.error .ql-container {
   border-color:#dc3545;
   background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
   background-repeat:no-repeat;
   background-position:right calc(.375em + .1875rem) center;
   background-size:calc(.75em + .375rem) calc(.75em + .375rem)
 }
 .form-group.error .ql-toolbar {
   border-color:#dc3545;
 }
</style>

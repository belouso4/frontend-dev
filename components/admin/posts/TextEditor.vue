<template>
    <vue-editor
      :editorOptions="editorOption"
      placeholder="Напишите что-нибудь..."
      ref="editor"
      v-model="content"
      @text-change="$emit('input', content)"/>

<!--  <quill-editor-->
<!--    ref="editor"-->
<!--    :options="editorOption"-->
<!--    :value="value"-->
<!--    @change="onEditorChange"-->
<!--  />-->
</template>

<script>
// let VueEditor

// if (process.client) {
//   VueEditor = require('vue2-editor').VueEditor
//   Quill = require('vue2-editor').Quill
// }

export default {
  name: "TextEditor",
  props: ['value'],
  // components: {VueEditor},
  data() {
    return {
      company: 'po0099',
      editor: null,
      content: '',
      editorOption: {
        placeholder: 'Введите описание...',
        theme: 'snow',
        modules: {
          imageResize: {modules: ['Resize', 'DisplaySize', 'Toolbar' ]},
          imageUploader: {
             upload: async (file) => {
               try {
                 let formData = new FormData();
                 formData.append('img', file);
                 return await this.$api.adminPosts.upload(formData)
               } catch (err) {console.log(err)}
            },
          },
          toolbar: {
            container: [
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
          }
        },
      },
    }
  },

  methods: {
    onEditorChange(value) {
      this.$emit('input', value.html)
    },
    getImgUrls(delta) {
      return delta.ops.filter(i => i.insert && i.insert.image).map(i => i.insert.image);
    },
    // addHtml() {
    //   this.quillEditor.updateContents([
    //     { insert: { signature: 1 } },
    //   ]);
    // }
  },

  computed: {
    quillEditor() {
      return this.$refs.editor.quill
    },
  },

  mounted() {
    this.content = this.value;
    this.quillEditor.on('text-change', (delta, oldContents, source) => {
      if (source !== 'user') return;

      const inserted = this.getImgUrls(delta);
      const deleted = this.getImgUrls(this.quillEditor.getContents().diff(oldContents));

      // inserted.length && console.log('insert', inserted)
      // deleted.length && console.log('delete', deleted)

      if (deleted.length && deleted[0].length < 200) {
        let array = deleted[0].split('/')
        let file_name = array[array.length - 1]

        this.$api.adminPosts.deleteImage({delete_file: file_name})
      }
    });
  }

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
   transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
 }
</style>

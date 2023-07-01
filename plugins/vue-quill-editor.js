import Vue from 'vue'
// // import Quill  from 'quill'
// // import VueQuillEditor from 'vue-quill-editor'
import Vue2Editor, {Quill} from "vue2-editor";
import ImageUploader from "quill-image-uploader";
import ImageResize from 'quill-image-resize-vue';

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css' // for bubble theme
import 'quill-image-uploader/dist/quill.imageUploader.min.css';

// Vue.use(VueQuillEditor)
Vue.use(Vue2Editor)

Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/imageResize", ImageResize);



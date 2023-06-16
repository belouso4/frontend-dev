import Vue from 'vue'
import Quill  from 'quill'
import VueQuillEditor from 'vue-quill-editor'
import ImageUploader from "quill-image-uploader";

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css' // for bubble theme
import 'quill-image-uploader/dist/quill.imageUploader.min.css';

Vue.use(VueQuillEditor)
Quill.register("modules/imageUploader", ImageUploader);



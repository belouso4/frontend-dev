import $axios from "axios";
export default class UploadAdapter {
  constructor( loader ) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file
      .then( file => new Promise( ( resolve, reject ) => {
        const data = new FormData();
        console.log(file)
        data.append( 'img', file );

        window.$nuxt.$api.adminPosts.upload(data).then(response => {
            resolve( {
              default: response
            } );
        }).catch(() => reject( 'Upload failed' ))
      } ) );
  }
}

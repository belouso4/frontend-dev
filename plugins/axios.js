export default function({app, route, $axios, redirect, store, error: nuxtError}) {
  // handle api errors

  $axios.onError(error => {
   console.log('--error.message--: ',error.response)
    const code = parseInt(error.response && error.response.status)
    console.log(error.message)
    // const url = app.context.from.path.split('/')
    const url = route.path.split('/')
    // console.log(url[1],code,app.context.from.path)


    if (process.server) {
      if (code === 404) {
        nuxtError({
          statusCode: error.response.status,
          message: 'Такой страницы не существует',
        });

        return Promise.resolve(false);
      }


      if (code === 500) {
        nuxtError({
          statusCode: error.response.status,
          message: error.message,
        });

        return Promise.resolve(true);
      }
    }


    if (process.client && url[1] === 'admin') {
      // if (code === 404 || code === 500) {
      //   redirect('/admin/404');
      // }


      if (code === 404) {
        nuxtError({
          statusCode: error.response.status,
          message: 'Такой страницы не существует',
        });

        return Promise.resolve(false);
      }

      if (code === 500) {
        nuxtError({
          statusCode: error.response.status,
          message: error.message,
        });
      }

      if (code === 422) {
        for (const [key, value] of Object.entries(error.response.data.errors)) {
          app.$toaster.error(value[0])
        }
        // return Promise.resolve(false);
      }
    }


    // if (code === 404) {
    //   if(url[1] === 'admin') {
    //     redirect('/admin/404');
    //   } else {
    //
    //   }
    // }


    // if (code === 403) {
    //   console.log(error)
    //   app.$toaster.error(error.message)
    // }



    if (code === 422) {
      store.dispatch('validation/setErrors', error.response.status)
    }

    // logout the user if the session expired
    if (app.$auth.loggedIn && [401, 419].includes(code) || error.response.data.ban === 1) {
      logout()
      return Promise.resolve(false);
    }
    // throw other errors
    return Promise.reject(error)
  })

  $axios.onRequest((config) => {
    config.progress = false;
    store.dispatch('validation/clearErrors')
  })

  async function logout() {
    await app.$auth.logout()
    // app.$auth.setToken('local', false)
    // store.commit('alerts/removeAll')
    if (route.path !== '/login') {
      redirect({ name: 'login' })
    }
  }
}

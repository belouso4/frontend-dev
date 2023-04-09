export default ({ store, route, redirect, $auth, error }) => {
  // Check if user is connected first

  if($auth.user.role === 'super-admin') return

  // Get authorizations for matched routes (with children routes too)
  const [authorizationLevels] = route.meta.map((meta) => {
    if (meta.permission && typeof meta.permission !== 'undefined')
      return meta.permission
    return 0
  })
  if (authorizationLevels === 0) return

  // accepts an array and a string
  if (typeof authorizationLevels === 'string') {
    if (!$auth.user.permission.includes(authorizationLevels)) {
      return error({
        statusCode: 401,
        message: 'Вы должны быть администратором, чтобы посетить эту страницу.'
      })
    }
  } else {
    const found = authorizationLevels.every(r=> $auth.user.permission.indexOf(r) >= 0)

    if (!found) return error({
      statusCode: 401,
      message: 'Вы должны быть администратором, чтобы посетить эту страницу.'
    })
  }

}

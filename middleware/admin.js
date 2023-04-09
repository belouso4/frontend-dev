export default function( context ) {
  try {
    if ( !context.$auth.loggedIn || !context.$auth.user.is_admin ) {
      return context.redirect('/');
    }
  } catch (e) { this.error = e.message; }
}

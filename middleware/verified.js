export default function( { store, redirect } ) {
    if ( store.state.auth.loggedIn && store.state.auth.user.email_verified_at == null ) {
        return redirect('/account/verify');
    }
}
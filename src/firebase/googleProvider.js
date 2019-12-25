export const googleProvider = new firebase.auth.GoogleAuthProvider();

googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly')

googleProvider.setCustomParameters({
    'login_hint': 'user@example.com'
});
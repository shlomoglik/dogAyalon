import app from './firebase/initFirebase';
import m from 'mithril';
const root = document.body;

export const auth = firebase.auth(app);
export const db = firebase.firestore();
// m.route.prefix('?')

auth.onAuthStateChanged(user=>{
    if(user){
        store.user.displayName = user.displayName
        store.user.email = user.email
        store.user.photoURL = user.photoURL
        user.getIdToken().then(token=>sessionStorage.setItem("token", token))
    }else{
        m.route.set("/login")
    }
})

import './style.scss';
import { Home } from './views/pages/home/Home';
import { Login } from './views/pages/login/Login';
import { NewInvitation } from './views/pages/newInvitation/NewInvitation';
import { store } from './data/store';

//routes config
m.route(root, "/home", {
    "/home": Home,
    "/login": Login,
    // "/app/invite": { onmatch: args => auth.currentUser === null ? Login : NewInvitation }
    "/app/invite": NewInvitation
});
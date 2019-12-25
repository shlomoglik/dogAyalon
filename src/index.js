import app from './firebase/initFirebase';
import m from 'mithril';
const root = document.body;


//FUNCTIONS
export const auth = firebase.auth(app);
export const db = firebase.firestore();
// m.route.prefix('?')

import './style.scss';
import { Home } from './views/pages/home/Home';
import { Login } from './views/pages/login/Login';
import { NewInvitation } from './views/pages/newInvitation/NewInvitation';

//routes config
m.route(root, "/home", {
    "/home": Home,
    "/login": Login,
    "/app/invite":NewInvitation
});
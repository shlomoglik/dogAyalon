import m from 'mithril';
const root = document.body;

import './style.css';

//functions
// m.route.prefix('?')

//Views
import UserPage from './views/UserPage/UserPage';

//data
import {getDoc} from './firebase/getData'

//routes config
m.route(root, "/login", {
    "/login": LoginPage,
    "/user": {
        onmatch: () => {
            let logged = true //define logged check;
            if (logged)
                return UserPage
            else m.route.set('/login')
        }
    },
});
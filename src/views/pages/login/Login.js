import m from "mithril";
import { auth } from "../../../index";
import { googleProvider } from "../../../firebase/googleProvider";
import { store } from "../../../data/store";

import { PageLayout } from "../../layout/page/Page";
import { CardLayout } from "../../layout/card/Card";

import "./style.scss"

export const Login = node => {
    const loginWithGoogle = async () => {
        try {
            const userCred = await auth.signInWithPopup(googleProvider)
            store.user.displayName = userCred.user.displayName
            store.user.email = userCred.user.email
            store.user.photoURL = userCred.user.photoURL
            // userCred.user.getIdToken() //localstorage ? 
            console.log(store.user)
            m.route.set("/app/invite")
        } catch (err) {
            console.error(err)
        }
    }
    return {
        view: vnode => {
            return (
                m(PageLayout, { class: "login" },
                    m(".back", { onclick: e => m.route.set("/home") }, "חזרה"),
                    m(CardLayout, { class: "login__card" },
                        m("form.login__form", [
                            m(".login__title", "התחבר באמצעות גוגל"),
                            m("button.button", { onclick: e => loginWithGoogle() }, [
                                m("img.button__img", { src: "https://img.icons8.com/color/48/000000/google-logo.png" }),
                            ])
                        ])
                    )
                )
            )
        }
    }
}
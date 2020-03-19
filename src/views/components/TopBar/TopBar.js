import m from "mithril"
import './style.scss'
import { store } from "../../../data/store"
import { auth } from "../../../index"

export const TopBar = node => {
    return {
        oninit: vnode => {
            setTimeout(() => {
                vnode.state.photoURL = store.user.photoURL || "img/noUser.jpg";
                m.redraw()
            }, 1000)
        },
        onupdate: vnode => {
            vnode.state.photoURL = store.user.photoURL || "img/noUser.jpg";
        },
        view: vnode => {
            return (
                m(".topBar", [
                    m(".logout", { onclick: e => auth.signOut() }, "התנתק"),
                    m(".user", [
                        m("img.user__img", { src: vnode.state.photoURL })
                    ]),
                ])
            )
        }
    }
}
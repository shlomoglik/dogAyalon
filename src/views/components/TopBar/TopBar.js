import m from "mithril"
import './style.scss'
import { store } from "../../../data/store"

export const TopBar = node => {
    return {
        view: vnode => {
            return (
                m(".topBar", [
                    m(".user", [
                        m("img.user__img", { src: store.user.photoURL || "img/noUser.jpg" })
                    ])
                ])
            )
        }
    }
}
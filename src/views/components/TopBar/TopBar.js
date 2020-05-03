import m from "mithril"
import './style.scss'
import { store } from "../../../data/store"
import { auth } from "../../../index"
import { Icon } from "../../commons/Icon/Icon"

export const TopBar = node => {
    const toggle = item => node.state[item] = !node.state[item]
    return {
        oninit: vnode => {
            setTimeout(() => {
                vnode.state.photoURL = store.user.photoURL || "img/noUser.jpg";
                m.redraw()
            }, 1500)
        },
        onupdate: vnode => {
            vnode.state.photoURL = store.user.photoURL || "img/noUser.jpg";
        },
        mainMenu: false,
        userMenu: false,
        view: vnode => {
            return (
                m(".topBar", [
                    // m(".menu", { onclick: e => toggle("mainMenu") }),
                    m(Icon, { icon: "icon-menu", class: "menu__button", action: e => toggle("mainMenu") }),
                    vnode.state.mainMenu && m(".menu__popUp", { onclick: e => toggle("mainMenu") },
                        m(".menu__box", { onclick: e => e.stopPropagation() },
                            m(".menu__title", m(Icon, { icon: "icon-x", action: e => toggle("mainMenu") }), "תפריט ראשי"),
                            m(".menu__item", { onclick: e => m.route.set("/home") }, "בית"),
                            m(".menu__item", { onclick: e => m.route.set("/app/invite") }, "הזמנות פנסיון"),
                            m(".menu__item", { onclick: e => auth.signOut() }, "התנתק")
                        )
                    ),
                    m(".user", { onclick: e => toggle("userMenu") }, m("img.user__img", { src: vnode.state.photoURL })),
                ])
            )
        }
    }
}
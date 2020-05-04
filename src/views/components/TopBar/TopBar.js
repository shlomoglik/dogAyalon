import m from "mithril"
import './style.scss'
import { store } from "../../../data/store"
import { auth } from "../../../index"
import { Icon } from "../../commons/Icon/Icon"

export const TopBar = node => {
    const MENU_ITEMS = [
        { text: "בית", icon: "icon-home", action: e => m.route.set("/home"), isActive: m.route.get() === "/home" },
        { text: "הזמנות פנסיון", icon: "icon-dog", action: e => m.route.set("/app/invite"), isActive: m.route.get() === "/app/invite" },
    ]
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
                            MENU_ITEMS.map(item => {
                                return m(".menu__item", { onclick: e => item.action(e) },
                                    m(".menu__item-text",item.text),
                                    item.icon && m(Icon, { icon: item.icon })
                                )
                            }),
                            m(".menu__item .menu__item--logout", { onclick: e => auth.signOut() },m(".menu__item-text", "התנתק"))
                        )
                    ),
                    m(".user", { onclick: e => toggle("userMenu") }, m("img.user__img", { src: vnode.state.photoURL })),
                ])
            )
        }
    }
}
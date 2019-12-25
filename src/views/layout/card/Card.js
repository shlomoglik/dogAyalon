import m from "mithril"

import "./style.scss"

export const CardLayout = node => {
    return {
        view: vnode => m(".card", { class: vnode.attrs.class }, vnode.children)
    }
}
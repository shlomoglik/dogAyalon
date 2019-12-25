import m from "mithril"

import "./style.scss"

export const PageLayout = node => {
    return {
        view: vnode => m(".page", { class: vnode.attrs.class }, vnode.children)
    }
}
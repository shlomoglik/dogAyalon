import m from "mithril"

import "./style.scss"
import { hideAnimation } from "../../../sass/utils"

export const CardLayout = node => {
    return {
        onbeforeremove: vnode => hideAnimation(vnode),
        view: vnode => m(".card fade-in", { class: vnode.attrs.class }, vnode.children)
    }
}
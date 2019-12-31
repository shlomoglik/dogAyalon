import m from "mithril"
import { TopBar } from "../../components/TopBar/TopBar"

import "./style.scss"

export const PageLayout = node => {
    return {
        view: vnode => m(".page", { class: vnode.attrs.class }, [
            m(TopBar),
            vnode.children
        ])
    }
}
import m from "mithril"
import "./style.scss"

export const Icon = node => {
    return {
        view: vnode => {
            return (
                m(`.icon`, { class: vnode.attrs.class || ""  , onclick:e=>vnode.attrs.action(e)}, [
                    m("svg.icon__svg",
                        m('use', { href: `/img/icons.svg#${vnode.attrs.icon}` })
                    )
                ])
            )
        }
    }
}
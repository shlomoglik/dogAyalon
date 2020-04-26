import m from "mithril"
import "./style.scss"

export const Tooltip = node => {
    return {
        view:vnode => {
            return m(".tooltip",
                m(".tooltip__text",vnode.attrs.text),
                m(Icon,{class:"tooltip__close",icon:"icon-x"})
            )
        }
    }
}
import m from "mithril"
import { Icon } from "../Icon/Icon";

import "./style.scss";


export const Caption = node => {
    return {
        view: vnode => {
            return m(".caption",
                m(".caption__text", vnode.attrs.text),
                vnode.attrs.icon && m(Icon, { icon: vnode.attrs.icon, class: vnode.attrs.iconClass || "" })
            )
        }
    }
}
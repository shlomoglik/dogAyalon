import m from "mithril"
import "./style.scss"
import { Icon } from "../../commons/Icon/Icon"

export const Tabs = node => {
    return {
        view: vnode => {
            return (
                m(".tabs", [
                    Object.entries(vnode.attrs.tabObj).map(([tabKey, tabSettings]) => {
                        return m(`.tabs__tab[data-active="${tabKey === vnode.attrs.parent.state.currentTab}"]`, {
                            onclick: e => { vnode.attrs.parent.state.currentTab = tabKey }
                        }, [
                            m("span", tabSettings.label),
                            tabSettings.icon && m(Icon, { icon: tabSettings.icon }),
                        ])
                    })
                ])
            )
        }
    }
}
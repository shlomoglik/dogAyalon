import m from "mithril"
import "./style.scss"

export const Tabs = node => {
    return {
        view: vnode => {
            return (
                m(".tabs", [
                    Object.entries(vnode.attrs.tabObj).map(([tabKey, tabSettings]) => {
                        return m(`.tabs__tab[data-active="${tabKey === vnode.attrs.parent.state.currentTab}"]`, {
                            onclick: e => {vnode.attrs.parent.state.currentTab = tabKey}
                        }, tabSettings.label)
                    })
                ])
            )
        }
    }
}

// const tabObj = {
//     tabKey: {label: "ראשי",},
// }
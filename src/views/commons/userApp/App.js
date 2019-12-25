import m from "mithril"

export const UserApp = node => {

    return {
        view: vnode => {
            return (
                m(".app", [
                    m("aside.sidebar", "תפריט צד"),
                    m(".topBar", "תפריט על"),
                    m("main.content", [
                        vnode.children
                    ])
                ])
            )
        }
    }

}
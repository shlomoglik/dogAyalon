import m from "mithril"
import { PageLayout } from "../../layout/page/Page"
import { CardLayout } from "../../layout/card/Card"

export const NewInvitation = node => {
    return {
        view: vnode => {
            return (
                m(PageLayout, { class: "invite" }, [
                    m(".invite__title", "הזמנת מקום לפנסיון"),
                    m("hr"),
                    m(CardLayout, { class: "invite__dogs" }, [
                        "כלב1","כלב2"
                    ]),
                ])
            )
        }
    }
}
import m from "mithril";

import { PageLayout } from "../../layout/page/Page";
import { CardLayout } from "../../layout/card/Card";

import "./style.scss"

export const Home = node => {
    const images = [
        { src: "/img/dogBg.jpg" }
    ]
    return {
        view: vnode => {
            return (
                m(PageLayout, { class: "home" }, [
                    m(CardLayout, { class: "welcome" },
                        m(".welcome__title", "ברוכים הבאים לפנסיון הכלבים של חוות עמק איילון"),
                        m(".welcome__login-link", { onclick: e => m.route.set("/login") }, "להתחברות לחץ כאן")
                    ),
                    m(CardLayout, { class: "photos" },
                        images.map(img => m("img", { src: img.src })),
                        m(".photos__nav", [
                            images.map(img =>
                                m(`.photos__nav-link[data-src="${img.src}"]`)
                            )
                        ])
                    ),
                ])
            )
        }
    }
}
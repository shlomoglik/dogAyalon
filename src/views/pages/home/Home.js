import m from "mithril";

import { loginWithGoogleData } from "../../../utils/auth";

import { PageLayout } from "../../layout/page/Page";
import { CardLayout } from "../../layout/card/Card";

import "./style.scss"
import { auth } from "../../../index";

export const Home = node => {
    const images = [
        { src: "/img/dogBg.jpg" }
    ]
    return {
        isLoggedIn: false,
        isLoading: true,
        oninit: vnode => {
            vnode.state.isLoading = true
            setTimeout(() => {
                auth.currentUser === null ? vnode.state.isLoggedIn = false : vnode.state.isLoggedIn = true;
                vnode.state.isLoading = false
                m.redraw()
            }, 2000);
        },
        view: vnode => {
            return (
                m(PageLayout, { class: "home" }, [
                    m(CardLayout, { class: "welcome" },
                        m(".welcome__title", "ברוכים הבאים לפנסיון הכלבים של חוות עמק איילון"),
                        vnode.state.isLoading ? null :
                            vnode.state.isLoggedIn ?
                                m(".welcome__login-link", { onclick: e => m.route.set("/app/invite") }, "להזמנת מקום לפנסיון")
                                :
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
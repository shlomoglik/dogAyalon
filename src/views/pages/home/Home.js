import m from "mithril";

import { loginWithGoogleData } from "../../../utils/auth";

import { PageLayout } from "../../layout/page/Page";
import { CardLayout } from "../../layout/card/Card";

import "./style.scss"
import { auth } from "../../../index";

export const Home = node => {
    const setNextImage = () => {
        const ind = images.findIndex(img => img.src === node.state.img.src)
        if (ind === -1) return
        if (ind === images.length - 1) node.state.img = images[0]
        else node.state.img = images[ind + 1]
    }
    const setPrevImage = () => {
        const ind = images.findIndex(img => img.src === node.state.img.src)
        if (ind === -1) return
        if (ind === 0) node.state.img = images[images.length]
        else node.state.img = images[ind - 1]
    }
    const isActive = (img) => node.state.img.src === img.src

    const images = [
        { src: "/img/dogBg.jpg" },
        { src: "/img/dogProfile.png" },
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
        img: images[0],
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
                        m("img", { src: vnode.state.img.src, onclick: e => setNextImage() }),
                        m(".photos__nav", [
                            images.map(img =>
                                m(`.photos__nav-link[data-src="${img.src}"][data-active="${isActive(img)}"]`, {
                                    onclick: e => vnode.state.img = img
                                })
                            )
                        ])
                    ),
                ])
            )
        }
    }
}
import m from "mithril";
import { loginWithGooglePopUp } from "../../../utils/auth";

import { PageLayout } from "../../layout/page/Page";
import { CardLayout } from "../../layout/card/Card";

import "./style.scss"

export const Login = node => {
    return {
        view: vnode => {
            return (
                m(PageLayout, { class: "login" },
                    m(".back", { onclick: e => m.route.set("/home") }, "חזרה"),
                    m(CardLayout, { class: "login__card" },
                        m("form.login__form", [
                            m(".login__title", "התחבר באמצעות גוגל"),
                            m("button.button", { onclick: e => loginWithGooglePopUp() }, [
                                m("img.button__img", { src: "/img/google-logo.png" }),
                            ])
                        ])
                    )
                )
            )
        }
    }
}
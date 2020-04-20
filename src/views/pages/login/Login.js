import m from "mithril";
import { loginWithGooglePopUp } from "../../../utils/auth";

import { PageLayout } from "../../layout/page/Page";
import { CardLayout } from "../../layout/card/Card";

import "./style.scss"
import { Icon } from "../../commons/Icon/Icon";

export const Login = node => {
    return {
        email: "",
        password: "",
        hidePass: true,
        view: vnode => {
            return (
                m(PageLayout, { class: "login" },
                    m(".back", { onclick: e => m.route.set("/home") }, "חזרה"),
                    m(CardLayout, { class: "login__card" },
                        m("form.login__form", { onsubmit: e => console.log(vnode.state.email, vnode.state.password) }, [
                            m(".login__title", "התחבר עם סיסמא"),
                            m(".login__row",
                                m("input.login__email [required] [type=email] [autocomplete=username]", { value: vnode.state.email, oninput: e => vnode.state.email = e.target.value }),
                                m("label.login__label", "אימייל")
                            ),
                            m(".login__row",
                                m(`input.login__password [required] [type=${vnode.state.hidePass ? "password" : "text"}][autocomplete=current-password]`, { value: vnode.state.password, oninput: e => vnode.state.password = e.target.value }),
                                m(Icon, { icon: `icon-${vnode.state.hidePass ? "hide" : "show"}`, action: e => vnode.state.hidePass = !vnode.state.hidePass }),
                                m("label.login__label", "סיסמא")
                            ),
                            m("button.button [type=submit]", "התחבר"),
                            m("hr"),
                            m(".login__title", "התחבר באמצעות גוגל"),
                            m("button.button", { onclick: e => loginWithGooglePopUp().then(()=>m.redraw()) }, [
                                m("img.button__img", { src: "/img/google-logo.png" }),
                            ])
                        ])
                    )
                )
            )
        }
    }
}
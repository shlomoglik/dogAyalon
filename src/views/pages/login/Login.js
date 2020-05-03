import m from "mithril";
import { loginWithGooglePopUp, setCurrentUser, loginWithEmail } from "../../../utils/auth";

import { PageLayout } from "../../layout/page/Page";
import { CardLayout } from "../../layout/card/Card";

import "./style.scss"
import { Icon } from "../../commons/Icon/Icon";
import { auth } from "../../../index";

export const Login = node => {
    const login = () => {
        if (node.state.email.trim() === "") return
        if (node.state.password.trim() === "") return
        
        return loginWithEmail(node.state.email, node.state.password)
    }
    return {
        email: "",
        password: "",
        hidePass: true,
        isUser: false,
        oninit: vnode => {
            Promise.resolve(setTimeout(() => {
                if (auth.currentUser !== null) {
                    return setCurrentUser(auth.currentUser)
                }
            }, 1500)
            ).finally(() => m.redraw())
        },
        view: vnode => {
            return (
                m(PageLayout, { class: "login" },
                    m(".back", { onclick: e => m.route.set("/home") }, "חזרה"),
                    m(CardLayout, { class: "login__card" },
                        m("form.login__form", { onsubmit: e => e.preventDefault() }, [
                            m(".login__title", "התחבר עם סיסמא"),
                            m(".login__row input",
                                m("label.input__label", "אימייל"),
                                m("input.input__field [required] [type=email] [autocomplete=username]", { value: vnode.state.email, oninput: e => vnode.state.email = e.target.value }),
                            ),
                            m(".login__row input",
                                m("label.input__label", "סיסמא"),
                                m(`input.login__password input__field [required] [type=${vnode.state.hidePass ? "password" : "text"}][autocomplete=current-password]`, { value: vnode.state.password, oninput: e => vnode.state.password = e.target.value }),
                                m(Icon, { icon: `icon-${vnode.state.hidePass ? "hide" : "show"}`, action: e => vnode.state.hidePass = !vnode.state.hidePass }),
                            ),
                            m("button.button", { onclick: e => login() }, "התחבר"),
                            // m("hr"),
                            // m(".login__title", "התחבר באמצעות גוגל"),
                            // m("button.button", { onclick: e => loginWithGooglePopUp() }, [
                            //     m("img.button__img", { src: "/img/google-logo.png" }),
                            // ])
                        ])
                    )
                )
            )
        }
    }
}
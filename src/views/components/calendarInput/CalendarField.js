import m from "mithril";
import { dateFormatDMY } from "../../../js/utils";
import { Icon } from "../../commons/Icon/Icon";

export const CalendarField = node => {
    return {
        view: vnode => {
            return m("label.form__row group__row", [
                vnode.attrs.label,
                m(".input",
                    m(".input__field selectDate", {
                        class: vnode.attrs.doc[vnode.attrs.inputKey] === "" ? "selectDate--invalid" : "",
                        onclick: e => {
                            vnode.attrs.parent.state.showCalendar = {
                                model: vnode.attrs.model,
                                saveOnClick: vnode.attrs.saveOnClick || false,
                                doc: vnode.attrs.doc,
                                inputKey: vnode.attrs.inputKey,
                                label: vnode.attrs.label,
                                rules: vnode.attrs.rules
                            }
                        }
                    },
                        vnode.attrs.doc[vnode.attrs.inputKey] === "" ? "--בחר תאריך--" : dateFormatDMY(new Date(vnode.attrs.doc[vnode.attrs.inputKey])),
                        vnode.attrs.doc[vnode.attrs.inputKey] !== "" && m(Icon, {
                            icon: "icon-x", action: e => {
                                e.stopPropagation();
                                vnode.attrs.doc[vnode.attrs.inputKey] = "";
                            }
                        })
                    )
                )
            ])
        }
    }
}

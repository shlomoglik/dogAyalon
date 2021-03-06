import m from "mithril";
import "./style.scss";
import { saveOne } from "../../../data/utils";

export const Input = node => {

    // console.log(node.attrs.headerObj)
    return {
        view: vnode => {
            return m("label.form__row group__row", [
                vnode.attrs.headerObj.label + ":",
                m(".input", m(`input.input__field${vnode.attrs.headerObj.disabled ? "[disabled]" : ""}`, {
                    value: vnode.attrs.doc[vnode.attrs.headerKey],
                    type: vnode.attrs.headerObj.type || "text",
                    oninput: e => vnode.attrs.doc[vnode.attrs.headerKey] = e.target.value,
                    onblur: e => {
                        if (vnode.attrs.isNew) return
                        else saveOne(vnode.attrs.model, { [vnode.attrs.headerKey]: e.target.value }, vnode.attrs.doc.docID)
                    }
                }))
            ])
        }
    }
}
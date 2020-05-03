import m from "mithril";
import "./style.scss";
import { Icon } from "../Icon/Icon";
import { saveOne } from "../../../data/utils";


export const SelectInput = node => {
    const headerKey = node.attrs.headerKey;
    const headerObj = node.attrs.headerObj;
    const doc = node.attrs.doc;
    const index = node.attrs.index;
    const list = Object.assign({}, headerObj.options)

    const toggleSearch = () => node.state.isSearchMode = !node.state.isSearchMode

    const matchToFilter = (term, value) => {
        let match = true
        if (term && term.length >= 2) {
            match = value.trim().indexOf(term.trim()) !== -1
        }
        return match
    }

    return {
        filterTerm: "",
        isSearchMode: false,
        view: vnode => {
            return m(`label.group__row`, { for: `${headerKey}_${index}` }, [
                headerObj.label,
                m(".input input--select", {
                    onclick: e => toggleSearch(),
                    "data-search": vnode.state.isSearchMode
                }, [
                    m(`.input__field input__field--select`, [
                        headerObj.options[doc[headerKey]],
                        m(Icon, { icon: vnode.state.isSearchMode ? "icon-triangle-up" : "icon-triangle-down", action: (e) => null })
                    ]),
                    m("input[type=hidden]", { value: doc[headerKey], oninput: e => console.log(e) }),
                    m(".form", { onclick: evt => evt.stopPropagation() }, [
                        m("input[type='search'][autoFocus][placeholder='חפש...']", {
                            value: vnode.state.filterTerm || '',
                            oninput: e => vnode.state.filterTerm = e.target.value,
                        }),
                        Object.entries(list).map(([key, value], ind) => {
                            return matchToFilter(vnode.state.filterTerm, value) === true && m(".option", {
                                id: key,
                                onclick: e => {
                                    doc[headerKey] = key;
                                    vnode.attrs.isNew ? null : saveOne(vnode.attrs.model, { [headerKey]: key }, doc.docID) // save data
                                    toggleSearch()
                                }
                            }, value)
                        })
                    ])
                ])
            ])
        }
    }
}

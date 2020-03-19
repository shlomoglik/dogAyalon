import m from "mithril"
import { PageLayout } from "../../layout/page/Page"
import { CardLayout } from "../../layout/card/Card"
import { Icon } from "../../commons/Icon/Icon"

import "./style.scss";
import { db, auth } from "../../../index";
import { store } from "../../../data/store";
import { docListener } from "../../../data/get/listen";

export const NewInvitation = node => {
    const inputTypes = {
        TEXT: "text",
        SELECT: "select",
        LIST: "list",
        NUMBER: "number"
    }

    const breeds = {
        "poodel": "פודל",
        "mixed": "מעורב"
    }

    const toggleSearch = ind => {
        node.state.searchList = node.state.searchList === ind ? false : ind
    }

    const matchToFilter = (term, value) => {
        let match = true
        if (term && term.length >= 2) {
            match = value.trim().indexOf(term.trim()) !== -1
        }
        return match
    }

    const Dogs = {
        headers: {
            name: { label: "שם הכלב", type: inputTypes.TEXT },
            gender: { label: "מין", type: inputTypes.SELECT, options: { male: "זכר", female: "נקבה", maleB: "זכר - מסורס", femaleB: "נקבה - מעוקרת" } },
            breed: { label: "גזע", type: inputTypes.SELECT, options: breeds },
            age: { label: "גיל", type: inputTypes.NUMBER },
        },
        data: [
            { name: "רקס", gender: "male", breed: "mixed" }
        ],
        new: []
    }
    const Clients = {
        headers: {
            clientName: { label: "שם", type: inputTypes.TEXT },
            clientEmail: { label: "אימייל", type: inputTypes.TEXT },
            clientPhone: { label: "טלפון" },
        },
        data: [
            // { displayName: "שלמה", phone: "053-3393623" }
        ],
        new: [],
        // current: { docID: 1, clientName: "שלמה", clientPhone: "053-3393623" },
        current: {},
        addNew: () => Clients.new.push({
            docID: Clients.new.length + 1,
            clientName: "",
            clientEmail: "",
            clientPhone: ""
        })
    }
    const Contacts = {
        headers: {
            contactName: { label: "שם", type: inputTypes.TEXT },
            contactEmail: { label: "אימייל", type: inputTypes.TEXT },
            contactPhone: { label: "טלפון" },
        },
        data: [],
        new: [],
        addNew: () => Contacts.new.push({
            docID: Contacts.new.length + 1,
            contactName: "",
            contactEmail: "",
            contactPhone: ""
        })
    }

    setTimeout(() => {
        docListener("clients", `clients/${auth.currentUser.uid}`, Clients.data);
        m.redraw()
    }, 1500);

    const removeOne = (source,dataSource, docID) => {
        source[dataSource] = source[dataSource].filter(doc => doc.docID !== docID)
        source[dataSource].forEach((doc, ind) => doc.docID = ind + 1)
    }
    const saveOne = (source,dataSource, doc) => {
        //TODO: save to DB and create listener to add one to data
    }

    return {
        filterListTerm: [],
        view: vnode => {
            return (
                m(PageLayout, { class: "invite" }, [
                    m(".invite__title", "הזמנת מקום לפנסיון"),
                    m(".owner part", [
                        m(".part__title", [
                            "פרטי קשר:",
                            m(Icon, { icon: "icon-plus", action: e => Contacts.addNew() })
                        ]),
                        m("span.caption", "בעלים"),
                        [...Clients.data].map(client => {
                            return Object.entries(Clients.headers).map(([headerKey, headerObj]) => {
                                return m("label.part__label", [
                                    headerObj.label + ":",
                                    m(".part__input", m(`input.part__input-field][disabled]`, { value: client[headerKey] }))
                                ])
                            })
                        }),
                        [...Contacts.data].map((doc, index) => {
                            return [
                                m("span.caption", `איש קשר נוסף[${doc.docID}]`),
                                Object.entries(Contacts.headers).map(([headerKey, headerObj]) => {
                                    return m("label.part__label", [
                                        headerObj.label + ":",
                                        m(".part__input", m(`input.part__input-field`, { value: doc[headerKey], oninput: e => doc[headerKey] = e.target.value }))
                                    ])
                                }),
                                m(".buttons", [
                                    m("span.button__text.button__text--remove", { onclick: e => removeOne(Contacts,"data", doc.docID) }, "מחק"),
                                    m("span.button__text.button__text--add", { onclick: e => saveOne(Contacts,"data", doc) }, "שמור"),
                                ])
                            ]
                        }),
                        [...Contacts.new].map((doc, index) => {
                            return [
                                m("span.caption", `איש קשר נוסף[${doc.docID}]`),
                                Object.entries(Contacts.headers).map(([headerKey, headerObj]) => {
                                    return m("label.part__label", [
                                        headerObj.label + ":",
                                        m(".part__input", m(`input.part__input-field`, { value: doc[headerKey], oninput: e => doc[headerKey] = e.target.value }))
                                    ])
                                }),
                                m(".buttons", [
                                    m("span.button__text.button__text--remove", { onclick: e => removeOne(Contacts, "new", doc.docID ) }, "מחק"),
                                    m("span.button__text.button__text--add", { onclick: e => saveOne(Contacts,"new" ,doc) }, "שמור"),
                                ])
                            ]
                        })
                    ]),
                    m(".part part--dogs", [
                        m(".part__title", "כלבים:"),
                        [...Dogs.data].map((doc, index) => {
                            return Object.entries(Dogs.headers).map(([headerKey, headerObj], ind) => {
                                switch (true) {
                                    case headerObj.type === inputTypes.SELECT:
                                        let list = Object.assign({}, headerObj.options)
                                        const filterTerm = vnode.state.filterListTerm[ind];
                                        return m(`label.part__label`, { for: `${headerKey}_${index}` }, [
                                            headerObj.label,
                                            m(".part__input part__input--select", {
                                                onclick: e => toggleSearch(ind),
                                                "data-search": ind === vnode.state.searchList
                                            }, [
                                                m(`.part__input-field part__input-field--select`, [
                                                    headerObj.options[doc[headerKey]],
                                                    m(Icon, { icon: "icon-triangle-down", action: (e) => null })
                                                ]),
                                                m(".form", { onclick: evt => evt.stopPropagation() }, [
                                                    m("input[type='search'][autoFocus][placeholder='חפש...']", {
                                                        // oninput: e => filterList(headerObj.options, e.target.value),
                                                        value: vnode.state.filterListTerm[ind] || '',
                                                        oninput: e => vnode.state.filterListTerm[ind] = e.target.value,
                                                    }),
                                                    Object.entries(list).map(([key, value], ind) => {
                                                        return matchToFilter(filterTerm, value) === true && m(".option", {
                                                            id: key,
                                                            onclick: e => {
                                                                doc[headerKey] = key
                                                                toggleSearch()
                                                            }
                                                        }, value)
                                                    })
                                                ])
                                            ])
                                        ])
                                    default:
                                        return m(`label.part__label`, { for: `${headerKey}_${index}` }, [
                                            headerObj.label,
                                            m(".part__input", [
                                                m(`input#${headerKey}_${index}.part__input-field`, { value: doc[headerKey], type: headerObj.type })
                                            ])
                                        ])
                                }
                            })
                        })
                    ])

                ])
            )
        }
    }
}
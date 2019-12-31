import m from "mithril"
import { PageLayout } from "../../layout/page/Page"
import { CardLayout } from "../../layout/card/Card"

import "./style.scss"
import { Icon } from "../../commons/Icon/Icon"

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

    let originalList
    const filterList = (localList, term) => {
        originalList = Object.assign(originalList || {}, localList)
        // if (term.length >= 2) {
        // Object.entries(originalList).forEach(([key, val]) => {
        //     if (val.trim().indexOf(term.trim()) !== -1) {
        //         localList[key] = val
        //     } else {
        //         localList[key]
        //     }
        // })
        // // }
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

    const Users = {
        headers: {
            displayName: { label: "שם", type: inputTypes.TEXT },
            phone: { label: "טלפון" },
        },
        data: [
            { displayName: "שלמה", phone: "053-3393623" }
        ],
        new: [],
        current: {}
    }

    return {
        view: vnode => {
            return (
                m(PageLayout, { class: "invite" }, [
                    m(".invite__title", "הזמנת מקום לפנסיון"),
                    m(".owner part", [
                        m(".part__title", "פרטי בעלים:"),
                        [...Users.data].map((doc, index) => {
                            return Object.entries(Users.headers).map(([headerKey, headerObj]) => {
                                return m("label.part__label", [
                                    headerObj.label + ":",
                                    m(".part__input", m(`input.part__input-field`, { value: doc[headerKey] }))
                                ])
                            })
                        })
                    ]),
                    m(".part part--dogs", [
                        m(".part__title", "כלבים:"),
                        [...Dogs.data].map((doc, index) => {
                            return Object.entries(Dogs.headers).map(([headerKey, headerObj], ind) => {
                                switch (true) {
                                    case headerObj.type === inputTypes.SELECT:
                                        let list = Object.assign({},headerObj.options)
                                        return m(`label.part__label`, { for: `${headerKey}_${index}` }, [
                                            headerObj.label,
                                            m(".part__input part__input--select", {
                                                onclick: e => toggleSearch(ind),
                                                "data-search": ind === vnode.state.searchList
                                            }, [
                                                m(`.part__input-field part__input-field--select`, [
                                                    headerObj.options[doc[headerKey]],
                                                    m(Icon, { icon: "icon-triangle-down" })
                                                ]),
                                                m(".form", { onclick: evt => evt.stopPropagation() }, [
                                                    m("input[type='search'][autoFocus][placeholder='חפש...']", {
                                                        oninput: e => filterList(headerObj.options, e.target.value),
                                                    }),
                                                    Object.entries(list).map(([key, value], ind) => {
                                                        return m(".option", {
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
import m from "mithril"
import { PageLayout } from "../../layout/page/Page"
import { CardLayout } from "../../layout/card/Card"

import "./style.scss"

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

    const originalList
    const filterList = (localList, term ) => {
        originalList = Object.assign({}, localList)
        if (term.length >= 2) {
            Object.entries(localList).forEach(([key, val]) => {
                if (val.trim().indexOf(term.trim()) !== -1) {
                    localList[key] = val
                } else {
                    delete localList[key]
                }
            })
        }
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
        ]
    }
    return {
        view: vnode => {
            return (
                m(PageLayout, { class: "invite" }, [
                    m(".invite__title", "הזמנת מקום לפנסיון"),
                    m(".owner part", [
                        m(".part__title", "פרטי בעלים:"),
                        m("label.part__label", [
                            "שם הבעלים:",
                            m(".part__input",
                                m(`input#ownerName.part__input-field`, { value: "שלמה" })
                            )
                        ]),
                        m("label.part__label", [
                            "טלפון:",
                            m(".part__input",
                                m(`input#ownerPhone.part__input-field`, { value: "053-3393623" })
                            )
                        ]),
                    ]),
                    m(".part part--dogs", [
                        m(".part__title", "כלבים:"),
                        [...Dogs.data].map((doc, index) => {
                            return Object.entries(Dogs.headers).map(([headerKey, headerObj], ind) => {
                                switch (true) {
                                    case headerObj.type === inputTypes.SELECT:
                                        return m(`label.part__label`, { for: `${headerKey}_${index}` }, [
                                            headerObj.label,
                                            m(".part__input part__input--select", {
                                                onclick: e => toggleSearch(ind),
                                                "data-search": ind === vnode.state.searchList
                                            }, [
                                                m(`.part__input-field`, headerObj.options[doc[headerKey]]),
                                                m(".form", { onclick: evt => evt.stopPropagation() }, [
                                                    m("input[type='search'][autoFocus][placeholder='חפש...']", { onkeyup: e => filterList(headerObj.options, e.target.value) }),
                                                    Object.entries(headerObj.options).map(([key, value], ind) => {
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
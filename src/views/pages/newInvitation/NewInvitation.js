import m from "mithril"
import { PageLayout } from "../../layout/page/Page"
import { CardLayout } from "../../layout/card/Card"
import { Icon } from "../../commons/Icon/Icon"

import "./style.scss";
import { db, auth } from "../../../index";
import { store } from "../../../data/store";
import { docListener, queryListener } from "../../../data/get/listen";

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
        meta: {
            routes: { collection: "clients" }
        },
        headers: {
            clientName: { label: "שם", type: inputTypes.TEXT },
            clientEmail: { label: "אימייל", type: inputTypes.TEXT, disabled: true },
            clientPhone: { label: "טלפון" },
        },
        data: [],
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
        meta: {
            routes: { collection: `clients/:userID/contacts` }
        },
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
        queryListener(Contacts.data, db.collection(`clients/${auth.currentUser.uid}/contacts`));
    }, 1500)

    const removeOneLocal = (source, dataSource, docID) => {
        source[dataSource] = source[dataSource].filter(doc => doc.docID !== docID)
        source[dataSource].forEach((doc, ind) => doc.docID = ind + 1)
    }
    const saveOne = (sourceModel, docToSave, docID) => {
        let saveDoc = Object.assign(docToSave, {
            updatedAt: new Date().toISOString(),
            updatedBy: auth.currentUser.uid
        })
        const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
        const path = `${collectionPath}/${docID}`;
        db.doc(path).set(saveDoc, { merge: true })
            .then(() => m.redraw())
            .catch(err => alert(err))
    }
    const insertOne = (sourceModel, docToAdd) => {
        let addDoc = Object.assign(docToAdd, {
            createdAt: new Date().toISOString(),
            createdBy: auth.currentUser.uid
        })
        const docID = addDoc.docID;
        delete addDoc.docID;
        const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
        const colRef = db.collection(collectionPath);
        colRef.add(addDoc)
            .then(() => removeOneLocal(sourceModel, "new", docID))
            .catch(err => alert(err))
            .finally(() => m.redraw())
    }

    function getCollectionPath(_path) {
        let path = _path;
        let split = path.split("/");
        if (split.length > 1) {
            let replace = split.map(part => {
                if (part.startsWith(":")) {
                    switch (part) {
                        case ":userID":
                            return auth.currentUser.uid
                    }
                } else {
                    return part
                }
            })
            path = replace.join("/");
        }
        return path;
    }

    return {
        filterListTerm: [],
        view: vnode => {
            return (
                m(PageLayout, { class: "invite" }, [
                    m(".invite__title", "הזמנת מקום לפנסיון"),
                    m(".owner group", [
                        m(".group__title", [
                            "פרטי קשר:",
                            m(Icon, { icon: "icon-plus", action: e => Contacts.addNew() })
                        ]),
                        m(".caption", m(".caption__text",`בעלים`)),
                        [...Clients.data].map(client => {
                            return Object.entries(Clients.headers).map(([headerKey, headerObj]) => {
                                return m("label.group__label", [
                                    headerObj.label + ":",
                                    m(".group__input", m(`input.group__input-field${headerObj.disabled ? "[disabled]" : ""}`, {
                                        value: client[headerKey],
                                        oninput: e => client[headerKey] = e.target.value,
                                        onblur: e => saveOne(Clients, { [headerKey]: e.target.value }, client.docID)
                                    }))
                                ])
                            })
                        }),
                        [...Contacts.data].map((doc, index) => {
                            return [
                                m(".caption", [
                                    m("span.caption__text", `איש קשר [${index + 1}]`),
                                    m(Icon, { icon: "icon-triangle-down", class: "icon--action", action: e => null })
                                ]),
                                Object.entries(Contacts.headers).map(([headerKey, headerObj]) => {
                                    return m("label.group__label", [
                                        headerObj.label + ":",
                                        m(".group__input", m(`input.group__input-field`, {
                                            value: doc[headerKey],
                                            oninput: e => doc[headerKey] = e.target.value,
                                            onblur: e => saveOne(Contacts, { [headerKey]: e.target.value }, doc.docID)
                                        }))
                                    ])
                                })
                            ]
                        }),
                        [...Contacts.new].map((doc, index) => {
                            return [
                                m(".caption", m(".caption__text",`איש קשר נוסף[${doc.docID}]`)),
                                Object.entries(Contacts.headers).map(([headerKey, headerObj]) => {
                                    return m("label.group__label", [
                                        headerObj.label + ":",
                                        m(".group__input", m(`input.group__input-field`, { value: doc[headerKey], oninput: e => doc[headerKey] = e.target.value }))
                                    ])
                                }),
                                m(".buttons", [
                                    m("span.button__text.button__text--remove", { onclick: e => removeOneLocal(Contacts, "new", doc.docID) }, "מחק"),
                                    m("span.button__text.button__text--add", { onclick: e => insertOne(Contacts, doc) }, "הוסף"),
                                ])
                            ]
                        })
                    ]),
                    m(".group group--dogs", [
                        m(".group__title", "כלבים:"),
                        [...Dogs.data].map((doc, index) => {
                            return Object.entries(Dogs.headers).map(([headerKey, headerObj], ind) => {
                                switch (true) {
                                    case headerObj.type === inputTypes.SELECT:
                                        let list = Object.assign({}, headerObj.options)
                                        const filterTerm = vnode.state.filterListTerm[ind];
                                        const isSearchMode = ind === vnode.state.searchList;
                                        return m(`label.group__label`, { for: `${headerKey}_${index}` }, [
                                            headerObj.label,
                                            m(".group__input group__input--select", {
                                                onclick: e => toggleSearch(ind),
                                                "data-search": isSearchMode
                                            }, [
                                                m(`.group__input-field group__input-field--select`, [
                                                    headerObj.options[doc[headerKey]],
                                                    m(Icon, { icon: isSearchMode ? "icon-triangle-up" : "icon-triangle-down", action: (e) => null })
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
                                        return m(`label.group__label`, { for: `${headerKey}_${index}` }, [
                                            headerObj.label,
                                            m(".group__input", [
                                                m(`input#${headerKey}_${index}.group__input-field`, { value: doc[headerKey], type: headerObj.type })
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
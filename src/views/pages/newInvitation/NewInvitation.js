import m from "mithril"
import { PageLayout } from "../../layout/page/Page"
import { CardLayout } from "../../layout/card/Card"
import { Icon } from "../../commons/Icon/Icon"

import "./style.scss";
import { db, auth } from "../../../index";
import { store } from "../../../data/store";
import { docListener, queryListener } from "../../../data/get/listen";
import { Tabs } from "../../components/tabs/Tabs";
import { Caption } from "../../commons/caption/Caption";
import { Input } from "../../commons/Input/Input";
import { getCollectionPath, removeOneLocal, insertOne } from "../../../data/utils";
import { SelectInput } from "../../commons/select/SelectInput";

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

    const Dogs = {
        meta: {
            routes: { collection: `clients/:userID/dogs` }
        },
        headers: {
            dogName: { label: "שם הכלב", type: inputTypes.TEXT },
            dogGender: { label: "מין", type: inputTypes.SELECT, options: { male: "זכר", female: "נקבה", maleB: "זכר - מסורס", femaleB: "נקבה - מעוקרת" } },
            dogBreed: { label: "גזע", type: inputTypes.SELECT, options: breeds },
            age: { label: "גיל", type: inputTypes.NUMBER, parseInput: "numToDate", parseValue: "dateToNum" },
        },
        data: [],
        new: [],
        addNew: () => Dogs.new.push({
            docID: Dogs.new.length + 1,
            dogName: "",
            dogGender: "",
            dogBreed: "",
            age: ""
        })
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

    const Invitation = {
        meta: {
            routes: { collection: `clients/:userID/invitations` }
        },
        headers: {
            dogs: { label: "כלבים" },
            contacts: { label: "אנשי קשר" },
            from: { label: "מתאריך" },
            to: { label: "ועד תאריך" },
        },
        current: {
            dogs: [],
            contacts: [],
            from: "",
            to: ""
        },
        data: [],
        addNew: () => null,
    }

    const toggleSelectInvitation = (item, docID) => {
        const index = Invitation.current[item].findIndex(id => id === docID)
        if (index === -1) {
            Invitation.current[item].push(docID)
        } else {
            Invitation.current[item].splice(index - 1, 1)
        }
    }

    Promise.resolve(setTimeout(() => {
        if (auth.currentUser !== null) {
            docListener("clients", `clients/${auth.currentUser.uid}`, Clients.data);
            queryListener(Contacts.data, db.collection(`clients/${auth.currentUser.uid}/contacts`));
            queryListener(Dogs.data, db.collection(`clients/${auth.currentUser.uid}/dogs`));
        } else {
            m.route.set("/login")
        }
    }, 1500))
        .then(() => m.redraw())

    return {
        filterListTerm: [],
        currentTab: "contacts",
        view: vnode => {
            return (
                m(PageLayout, { class: "invite" }, [
                    m(".invite__title", "הזמנת מקום לפנסיון"),
                    m(Tabs, {
                        parent: vnode,
                        tabObj: {
                            contacts: { label: "פרטי קשר", icon: "icon-users" },
                            dogs: { label: "כלבים", icon: "icon-dog" },
                            invitation: { label: "פרטי הזמנה", icon: "icon-calendar" }
                        }
                    }),

                    vnode.state.currentTab === "contacts" && m(".owner group", [
                        m(".group__title", "פרטי קשר:"),
                        m(CardLayout, [
                            m(Caption, { text: "בעלים" }),
                            [...Clients.data].map(client => {
                                return Object.entries(Clients.headers).map(([headerKey, headerObj]) => {
                                    return m(Input, { model: Clients, doc: client, headerKey, headerObj })
                                })
                            }),
                        ]),
                        [...Contacts.data].map((contact, index) => {
                            return m(CardLayout, [
                                m(Caption, { text: `איש קשר [${index + 1}]`, icon: "icon-triangle-down", iconClass: "icon--action" }),
                                Object.entries(Contacts.headers).map(([headerKey, headerObj]) => {
                                    return m(Input, { model: Contacts, doc: contact, headerKey, headerObj })
                                })

                            ])
                        }),
                        [...Contacts.new].map((doc, index) => {
                            return m(CardLayout, { class: "new" }, [
                                m(Caption, { text: `איש קשר נוסף[${doc.docID}]` }),
                                Object.entries(Contacts.headers).map(([headerKey, headerObj]) => {
                                    return m(Input, { model: Contacts, doc, headerKey, headerObj, isNew: true })
                                }),
                                m(".buttons", [
                                    m("span.button__text.button__text--remove", { onclick: e => removeOneLocal(Contacts, "new", doc.docID) }, "מחק"),
                                    m("span.button__text.button__text--add", { onclick: e => insertOne(Contacts, doc) }, "הוסף"),
                                ])
                            ])
                        }),
                        m(CardLayout, { class: "addNew" }, m(".", { onclick: e => Contacts.addNew() }, "+ הוסף איש קשר"))
                    ]),

                    vnode.state.currentTab === "dogs" && m(".group group--dogs", [
                        m(".group__title", "כלבים:"),
                        [...Dogs.data].map((doc, index) => {
                            return m(CardLayout, [
                                Object.entries(Dogs.headers).map(([headerKey, headerObj], ind) => {
                                    switch (true) {
                                        case headerObj.type === inputTypes.SELECT:
                                            return m(SelectInput, { model: Dogs, doc, index, headerKey, headerObj })
                                        default:
                                            return m(Input, { model: Dogs, doc, headerKey, headerObj })
                                    }
                                })
                            ])
                        }),
                        [...Dogs.new].map((doc, index) => {
                            return m(CardLayout, { class: "new" }, [
                                m(Caption, { text: `כלב נוסף[${doc.docID}]` }),
                                Object.entries(Dogs.headers).map(([headerKey, headerObj], ind) => {
                                    switch (true) {
                                        case headerObj.type === inputTypes.SELECT:
                                            return m(SelectInput, { doc, index, headerKey, headerObj, isNew: true })
                                        default:
                                            return m(Input, { model: Dogs, doc, headerKey, headerObj, isNew: true })
                                    }
                                }),
                                m(".buttons", [
                                    m("span.button__text.button__text--remove", { onclick: e => removeOneLocal(Dogs, "new", doc.docID) }, "מחק"),
                                    m("span.button__text.button__text--add", { onclick: e => insertOne(Dogs, doc) }, "הוסף"),
                                ])
                            ])
                        }),
                        m(CardLayout, { class: "addNew" }, m(".", { onclick: e => Dogs.addNew() }, "+ הוסף כלב"))
                    ]),

                    vnode.state.currentTab === "invitation" &&
                    m(".group group--dogs",
                        m(".group__title", "פרטי ההזמנה:"),
                        m(CardLayout,
                            m(Caption, { text: "אנשי קשר" }),
                            [...Contacts.data].map(doc => {
                                const isSelected = Invitation.current.contacts.includes(doc.docID)
                                return m(".row", {
                                    onclick: e => toggleSelectInvitation("contacts", doc.docID),
                                    class: isSelected ? "row--active" : ""
                                },
                                    m(".row__cell",
                                        m(".checkBox",
                                            isSelected && m(Icon, { icon: "icon-check" })
                                        )
                                    ),
                                    m(".row__cell", doc.contactName),
                                )
                            })
                        ),
                        m(CardLayout,
                            m(Caption, { text: "כלבים" }),
                            [...Dogs.data].map(doc => {
                                const isSelected = Invitation.current.dogs.includes(doc.docID)
                                return m(".row", {
                                    onclick: e => toggleSelectInvitation("dogs", doc.docID),
                                    class: isSelected ? "row--active" : ""
                                },
                                    m(".row__cell",
                                        m(".checkBox",
                                            isSelected && m(Icon, { icon: "icon-check" })
                                        )
                                    ),
                                    m(".row__cell", doc.dogName),
                                )
                            })
                        ),
                        m(CardLayout, { class: "dates" },
                            m(Caption, { text: "תאריכים" }),
                            m(Input, {
                                model: Invitation,
                                doc: Invitation.current,
                                headerKey: "from",
                                headerObj: Invitation.headers.from
                            }),
                            m(Input, { 
                                model: Invitation,
                                doc: Invitation.current,
                                headerKey: "to",
                                headerObj: Invitation.headers.to 
                            }),
                        ),
                    )
                ])
            )
        }
    }
}
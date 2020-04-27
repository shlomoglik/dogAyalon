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
import { CalendarInput } from "../../components/calendarInput/CalendarInput";
import { dateFormatDMY, distDays } from "../../../js/utils";
import { AFTER_TODAY, AFTER_DATE, BEFORE_DATE } from "../../components/calendarInput/options";
import { FileUpload } from "../../commons/fileUpload/FileUpload";
import { invitationStatus } from "../../../data/settings";

export const NewInvitation = node => {
    const inputTypes = {
        TEXT: "text",
        SELECT: "select",
        LIST: "list",
        NUMBER: "number",
        HIDDEN: "hidden"
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
            dogPhoto: { label: "תמונה", type: "hidden" },
            age: { label: "גיל", type: inputTypes.NUMBER },
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
            sDate: { label: "מתאריך" },
            sTime: { label: "משעה", type: "time" },
            eDate: { label: "ועד תאריך" },
            eTime: { label: "עד שעה", type: "time" },
        },
        current: {
            dogs: [],
            contacts: [],
            sDate: "",
            eDate: "",
            sTime: "",
            eTime: ""
        },
        data: [],
        addNew: () => {
            Invitation.current = {
                dogs: [],
                contacts: [],
                sDate: "",
                eDate: "",
                sTime: "",
                eTime: ""
            };
            node.state.displayInvitation = "new"
        },
    }

    const toggleSelectInvitation = (item, docID) => {
        const index = Invitation.current[item].findIndex(id => id === docID)
        if (index === -1) {
            Invitation.current[item].push(docID)
        } else {
            Invitation.current[item].splice(index, 1)
        }
    }

    const toggleCardDisplay = card => {
        node.state.cardsDisplay[card] = !node.state.cardsDisplay[card]
    };

    const getTotalDatesStatment = () => {
        let statement = "לא נבחרו תאריכים";
        if (Invitation.current.sDate !== "" && Invitation.current.eDate !== "") {
            const diff = distDays(new Date(Invitation.current.sDate), new Date(Invitation.current.eDate))
            statement = "משך : " + diff + " יום";
            if (Invitation.current.eTime !== "") {
                const hour = parseInt(Invitation.current.eTime.split(":")[0])
                if (hour >= 11) {
                    statement += " (יציאה אחרי 11)"
                }
            }
        }
        return statement
    }

    const isValidInvitaion = param => {
        const validDates = Invitation.current.sDate !== "" && Invitation.current.eDate !== ""
        const validDogs = Invitation.current.dogs.length > 0
        const validTerms = true
        if (param && param === "dates") return validDates
        if (param && param === "dogs") return validDogs
        if (param && param === "terms") return validTerms
        return validDates && validDogs && validTerms
    }

    const sendInvitation = () => {
        try {
            Promise.resolve(insertOne(Invitation, Object.assign({ status: "new" }, Invitation.current)))
                .then(() => node.state.displayInvitation = "all")
        } catch (e) {
            console.error(e)
        }
    }

    Promise.resolve(setTimeout(() => {
        if (auth.currentUser !== null) {
            docListener("clients", `clients/${auth.currentUser.uid}`, Clients.data);
            queryListener(Contacts.data, db.collection(`clients/${auth.currentUser.uid}/contacts`));
            queryListener(Dogs.data, db.collection(`clients/${auth.currentUser.uid}/dogs`));
            queryListener(Invitation.data, db.collection(`clients/${auth.currentUser.uid}/invitations`));
        } else {
            m.route.set("/login")
        }
    }, 2000))
        .then(() => m.redraw())

    return {
        filterListTerm: [],
        currentTab: "contacts",
        displayInvitation: "all",
        showCalendar: false,
        cardsDisplay: {
            "dates": true
        },
        view: vnode => {
            return (
                m(PageLayout, { class: "invite" }, [
                    m(".invite__title", "הזמנת מקום לפנסיון"),
                    m(Tabs, {
                        parent: vnode,
                        tabObj: {
                            contacts: { label: "פרטי קשר", icon: "icon-users" },
                            dogs: { label: "כלבים", icon: "icon-dog" },
                            invitation: { label: "הזמנות", icon: "icon-calendar" }
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
                                m(FileUpload, { path: `${getCollectionPath(Dogs.meta.routes.collection)}/${doc.docID}`, inputKey: "dogPhoto", value: doc.dogPhoto || "" }),
                                Object.entries(Dogs.headers).map(([headerKey, headerObj], ind) => {
                                    switch (true) {
                                        case headerObj.type === inputTypes.SELECT:
                                            return m(SelectInput, { model: Dogs, doc, index, headerKey, headerObj })
                                        case headerObj.type === inputTypes.HIDDEN: return null
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
                                        case headerObj.type === inputTypes.HIDDEN: return null
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

                    (vnode.state.currentTab === "invitation" && vnode.state.displayInvitation === "all") &&
                    m(".group group--invitation",
                        m(".group__title", "ההזמנות שלי:"),
                        Invitation.data.map(doc => {
                            console.log(doc)
                            const sDate = new Date(doc.sDate)
                            const eDate = new Date(doc.eDate)
                            return m(CardLayout,
                                m(".invitation__dogs",
                                    doc.dogs.map(dogRef => {
                                        const dog = Dogs.data.find(doc => doc.docID === dogRef)
                                        return m(".invitation__dog", dog.dogName)
                                    }),
                                ),
                                m(".invitation__dates",
                                    m(".invitation__date",
                                        m("span", dateFormatDMY(sDate)),
                                        m("span", sDate.getDay())
                                    ),
                                    m(Icon, { icon: "icon-arrow-left" }),
                                    m(".invitation__date",
                                        m("span",dateFormatDMY(eDate)),
                                        m("span",eDate.getDay()),
                                    ),
                                ),
                                m(".invitation__status", doc.status),
                            )
                        }),
                        m(CardLayout, { class: "addNew" }, m(".", { onclick: e => Invitation.addNew() }, "+ הוסף הזמנה"))
                    ),

                    (vnode.state.currentTab === "invitation" && vnode.state.displayInvitation === "new") &&
                    m(".group group--invitation",
                        m(".group__title", [
                            m(Icon, { icon: "icon-arrow-right", class: "icon--right", action: e => vnode.state.displayInvitation = "all" }),
                            "פרטי ההזמנה:",
                        ]),
                        m(CardLayout,
                            m(Caption, { text: "אנשי קשר" }),
                            m(".row row--active",
                                m(".row__cell", m(".checkBox", m(Icon, { icon: "icon-check" }))),
                                m(".row__cell", Clients.data[0].clientName)
                            ),
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
                                            { class: isSelected ? "" : "checkBox--invalid" },
                                            isSelected && m(Icon, { icon: "icon-check" })
                                        )
                                    ),
                                    m(".row__cell", doc.dogName),
                                )
                            })
                        ),
                        m(CardLayout, { class: "dates" },
                            m(Caption, {
                                text: "תאריכים",
                                action: e => toggleCardDisplay("dates"),
                                icon: vnode.state.cardsDisplay.dates === true ? false : "icon-chevron-thin-up"
                            }),
                            vnode.state.showCalendar !== false &&
                            m(CalendarInput, {
                                parent: vnode,
                                doc: Invitation.current,
                                inputKey: vnode.state.showCalendar.inputKey,
                                label: vnode.state.showCalendar.label,
                                rules: vnode.state.showCalendar.rules
                            }),

                            vnode.state.cardsDisplay.dates && [
                                m("label.form__row group__row", [
                                    "מתאריך:",
                                    m(".input",
                                        m(".input__field selectDate", {
                                            class: Invitation.current.sDate === "" ? "selectDate--invalid" : "",
                                            onclick: e => {
                                                vnode.state.showCalendar = {
                                                    inputKey: "sDate",
                                                    label: "מתאריך:",
                                                    rules: { [AFTER_TODAY]: true, [BEFORE_DATE]: Invitation.current.eDate }
                                                }
                                            }
                                        },
                                            Invitation.current.sDate === "" ? "--בחר תאריך--" : dateFormatDMY(new Date(Invitation.current.sDate)),
                                            Invitation.current.sDate !== "" && m(Icon, {
                                                icon: "icon-x", action: e => {
                                                    e.stopPropagation();
                                                    Invitation.current.sDate = "";
                                                }
                                            })
                                        )
                                    )
                                ]),
                                m(Input, { model: Invitation, doc: Invitation.current, headerKey: "sTime", headerObj: Invitation.headers.sTime }),
                                m("label.form__row group__row", [
                                    "עד תאריך:", //eDate
                                    m(".input",
                                        m(".input__field selectDate", {
                                            class: Invitation.current.eDate === "" ? "selectDate--invalid" : "",
                                            onclick: e => {
                                                vnode.state.showCalendar = {
                                                    inputKey: "eDate",
                                                    label: "עד תאריך:",
                                                    rules: { [AFTER_TODAY]: true, [AFTER_DATE]: Invitation.current.sDate }
                                                }
                                            }
                                        },
                                            Invitation.current.eDate === "" ? "--בחר תאריך--" : dateFormatDMY(new Date(Invitation.current.eDate)),
                                            Invitation.current.eDate !== "" && m(Icon, {
                                                icon: "icon-x", action: e => {
                                                    e.stopPropagation();
                                                    Invitation.current.eDate = "";
                                                }
                                            })
                                        )
                                    )
                                ]),
                                m(Input, { model: Invitation, doc: Invitation.current, headerKey: "eTime", headerObj: Invitation.headers.eTime }),
                            ],
                        ),
                        // m(".total", { class: isValidInvitaion("dates") ? "" : "total--invalid" },
                        //     m(".total__text", getTotalDatesStatment()),
                        // ),
                        isValidInvitaion() && m("button.button send", { onclick: e => sendInvitation() }, "שלח הזמנה")
                    )
                ])
            )
        }
    }
}
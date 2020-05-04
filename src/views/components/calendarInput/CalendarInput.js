import m from "mithril";
import "./style.scss";
import { Icon } from "../../commons/Icon/Icon";
import { dateFormatDMY } from "../../../js/utils";
import { AFTER_TODAY, AFTER_DATE, BEFORE_DATE, NOT_DAYS } from "./options";
import { saveOne } from "../../../data/utils";

export const CalendarInput = node => {

    const WEEK_DAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

    const initMonth = node.attrs.month || new Date().getMonth() + 1;
    const initYear = node.attrs.year || new Date().getFullYear();

    const setSelectedDate = (date) => {
        node.state.selectedDate = date;
        node.attrs.doc[node.attrs.inputKey] = date
        if (node.attrs.saveOnClick === true) {
            saveOne(node.attrs.model, { [node.attrs.inputKey]: date }, node.attrs.doc.docID)
        }
    }

    const updateDates = () => {
        const year = node.state.year;
        const month = node.state.month;
        node.state.dates = [];
        let d = 1;
        let m_ = month;
        while (m_ == month) {
            const date = new Date(year, Number(month) - 1, d)
            m_ = date.getMonth() + 1;
            if (m_ == month) node.state.dates.push(date.toDateString())
            d++;
        }
        m.redraw();
    }

    const isDisabledDate = (dateN, date) => {
        const todayN = new Date().setHours(0, 0, 0, 0);
        let isDisabled = false;
        if (node.attrs.rules) {
            if (node.attrs.rules[AFTER_TODAY] === true) isDisabled = dateN < todayN
            if (node.attrs.rules[AFTER_DATE] && node.attrs.rules[AFTER_DATE] !== "") isDisabled = isDisabled || dateN < new Date(node.attrs.rules[AFTER_DATE]).setHours(0, 0, 0, 0)
            if (node.attrs.rules[BEFORE_DATE] && node.attrs.rules[BEFORE_DATE] !== "") isDisabled = isDisabled || dateN > new Date(node.attrs.rules[BEFORE_DATE]).setHours(0, 0, 0, 0)
            //TESTME:
            if (node.attrs.rules[NOT_DAYS] && node.attrs.rules[NOT_DAYS].length > 0 && Array.isArray(node.attrs.rules[NOT_DAYS])) isDisabled = isDisabled || node.attrs.rules[NOT_DAYS].includes(date.getDay()+1)
            // TODO: add validation to IS_DATES  and NOT_DATES
        }
        return isDisabled
    }

    return {
        month: initMonth,
        year: initYear,
        dates: [],
        selectedDate: "",
        oninit: vnode => {
            updateDates(initYear, initMonth);
            vnode.state.selectedDate = vnode.attrs.doc[vnode.attrs.inputKey]
        },
        view: vnode => {
            return m(".calendar", { onclick: e => vnode.attrs.parent.state.showCalendar = false },
                m(".calendar__box", { onclick: e => e.stopPropagation() },
                    m(".calendar__title", [
                        // m("span", "חודש " + vnode.state.month + " שנת " + vnode.state.year), //THINK: option 1 use curr month title
                        m(`span`, {
                            class: vnode.state.selectedDate !== "" ? "calendar__title--link" : "",
                            onclick: e => {
                                const d = new Date(vnode.state.selectedDate);
                                vnode.state.year = d.getFullYear();
                                vnode.state.month = d.getMonth() + 1;
                                updateDates()
                            }
                        },
                            vnode.attrs.label + ` ${vnode.state.selectedDate !== "" ? dateFormatDMY(new Date(vnode.state.selectedDate)) : "--בחר--"}`
                        ),
                        m(Icon, {
                            icon: "icon-calendar",
                            action: e => {
                                const today = new Date();
                                vnode.state.year = today.getFullYear()
                                vnode.state.month = today.getMonth() + 1;
                                updateDates();
                            }
                        })
                    ]),
                    m(".calendar__filters", [
                        m(Icon, {
                            icon: "icon-chevron-thin-right", class: "calendar__arrow",
                            action: e => {
                                if (vnode.state.month == 1) {
                                    vnode.state.month = 12;
                                    vnode.state.year = vnode.state.year - 1;
                                } else {
                                    vnode.state.month = vnode.state.month - 1
                                }
                                updateDates()
                            }
                        }),
                        m("input.input__field calendar__filter[type=number][min=1][max=12]", {
                            value: vnode.state.month,
                            onfocus: e => e.target.oldVal = e.target.value,
                            oninput: e => {
                                if (e.target.value > 12 || e.target.value < 1) e.target.value = e.target.oldVal
                                else {
                                    vnode.state.month = e.target.value;
                                    updateDates()
                                }
                            }
                        }),
                        m(`input.input__field calendar__filter[type=number]`, {
                            value: vnode.state.year,
                            onfocus: e => e.target.oldVal = e.target.value,
                            oninput: e => {
                                vnode.state.year = e.target.value;
                                updateDates()
                            },
                            onblur: e => {
                                if (e.target.value.length > 4 || e.target.value.length < 4) {
                                    vnode.state.year = e.target.oldVal;
                                    updateDates()
                                }
                            }
                        }),
                        m(Icon, {
                            icon: "icon-chevron-thin-left", class: "calendar__arrow",
                            action: e => {
                                if (vnode.state.month == 12) {
                                    vnode.state.month = 1;
                                    vnode.state.year = parseInt(vnode.state.year) + 1;
                                } else {
                                    vnode.state.month = parseInt(vnode.state.month) + 1
                                }
                                updateDates()
                            }
                        }),
                    ]),
                    m(".calendar__grid",
                        WEEK_DAYS.map(el => m(".calendar__weekday", el)),
                        vnode.state.dates.map((d, ind) => {
                            const date = new Date(d)
                            const dateN = date.setHours(0, 0, 0, 0);
                            const todayN = new Date().setHours(0, 0, 0, 0);
                            const isSelected = dateN === new Date(vnode.state.selectedDate).setHours(0, 0, 0, 0);
                            const isDisabled = isDisabledDate(dateN, date)
                            const isToday = dateN === todayN
                            if (ind === 0) {
                                const dayOfWeek = date.getDay() + 1
                                return m(`.calendar__cell${isSelected ? " calendar__cell--selected" : ""}`, {
                                    "data-column": dayOfWeek,
                                    "data-disabled": isDisabled, "data-datetime": d, "data-today": isToday,
                                    onclick: e => isDisabled ? null : setSelectedDate(d)
                                },
                                    date.getDate()
                                )
                            }
                            return m(`.calendar__cell${isSelected ? " calendar__cell--selected" : ""}`, {
                                "data-disabled": isDisabled, "data-today": isToday, "data-datetime": d,
                                onclick: e => isDisabled ? null : setSelectedDate(d)
                            },
                                date.getDate()
                            )
                        })
                    )
                )
            )
        }
    }
}
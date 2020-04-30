
export const invitationStatus = {
    NEW: "new",
    UPDATE_SENT: "updateSent",
    CONFIRM: "confirm",
    REJECT: "reject",
    REMOVE_BY_USER: "removeByUser",
    ACTIVE: "active",
    DONE: "done",
    new: { label: "ממתין לאישור", next: ["updateSent", "confirm", "reject", "removeByUser"], color: "#007ed8" },
    updateSent: { label: "ממתין לעדכון", next: ["updateSent", "confirm", "reject", "removeByUser"], color: "#007ed8" },
    confirm: { label: "מאושר", next: ["updateSent", "removeByUser", "active"], color: "#08b308" },
    reject: { label: "נדחה", next: ["confirm"], color: "#eb2f64" },
    removeByUser: { label: "בוטל", next: ["reject", "confirm"], color: "#eb2f64" },
    active: { label: "פעיל", next: ["updateSent", "done"], color: "" },
    done: { label: "הסתיים", next: [], color: "" },
}

export const daysOfWeek = [
    { label: "ראשון" },
    { label: "שני" },
    { label: "שלישי" },
    { label: "רביעי" },
    { label: "חמישי" },
    { label: "שישי" },
    { label: "שבת" },
]
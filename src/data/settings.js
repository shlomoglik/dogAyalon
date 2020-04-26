
export const invitationStatus = {
    NEW: "new",
    UPDATE_SENT: "updateSent",
    CONFIRM: "confirm",
    REJECT: "reject",
    REMOVE_BY_USER: "removeByUser",
    ACTIVE: "active",
    DONE: "done",
    new: { label: "הזמנה חדשה", next: ["updateSent","confirm","reject","removeByUser"], color: "" },
    updateSent: { label: "עדכון", next: ["updateSent","confirm","reject","removeByUser"], color: "" },
    confirm: { label: "אישור", next: ["updateSent" , "removeByUser" , "active"], color: "" },
    reject: { label: "דחייה", next: ["confirm"], color: "" },
    removeByUser: { label: "הזמנה חדשה", next: ["reject", "confirm"], color: "" },
    active: { label: "הזמנה חדשה", next: ["updateSent","done"], color: "" },
    done: { label: "בוצע", next: [], color: "" },
}
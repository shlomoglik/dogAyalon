import { db } from "../../index"
import m from "mithril"

/**
 * @param {Object} dataSource source of data to listen to
 * @param {Function} query the query or collection reference
 * @return {Function} unsubscribe function which you could use later
 */
export const queryListener = (dataSource, query) => {
    const unsubscribe = query.onSnapshot(snap => {
        // if (snap.empty) return
        snap.docChanges().forEach(change => {
            const doc = change.doc
            const docData = Object.assign(doc.data(), {
                ref: doc.ref.path,
                docID: doc.id
            })
            const index = dataSource.findIndex((elem) => elem.docID === docData.docID)
            if (change.type === "added" || change.type === "modified") {
                if (index !== -1) dataSource[index] = docData
                else dataSource.push(docData)
            } else if (change.type === "removed") {
                dataSource.splice(index, 1)
            }
        })
        m.redraw();
    })
    return unsubscribe
}

export const docListener = (collectionPath, docPath, dataSource) => {
    db.collection(collectionPath).onSnapshot(snap => {
        snap.docChanges().forEach(change => {
            if (change.doc.ref.path === docPath) {
                const doc = change.doc
                const docData = Object.assign(doc.data(), {
                    ref: doc.ref.path,
                    docID: doc.id
                })
                // console.log(`${change.type} on => \n${JSON.stringify(docData)} `)
                const index = dataSource.findIndex((elem) => elem.docID === docData.docID)
                if (change.type === "added" || change.type === "modified") {
                    if (index !== -1) dataSource[index] = docData
                    else dataSource.push(docData)
                } else if (change.type === "removed") {
                    dataSource.splice(index, 1)
                }
            }
        })
        m.redraw()
    })
}
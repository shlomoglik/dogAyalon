import { auth, db } from "../index";
import m from "mithril";

export function getCollectionPath(_path) {
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


export function removeOneLocal(source, dataSource, docID) {
    const filter = source[dataSource].filter(doc => doc.docID != docID)
    source[dataSource] = []
    if (filter[0]) {
        source[dataSource] = [...filter]
        source[dataSource].forEach((doc, ind) => {
            doc.docID = ind + 1
        });
    }
}

export function insertOne(sourceModel, docToAdd) {
    let addDoc = Object.assign(docToAdd, {
        createdAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid
    })
    const docID = addDoc.docID;
    delete addDoc.docID;
    const collectionPath = getCollectionPath(sourceModel.meta.routes.collection)
    const colRef = db.collection(collectionPath);
    colRef.add(addDoc)
        .then(() => sourceModel.new = [])
        .catch(err => alert(err))
        .finally(() => m.redraw())
}


export function saveOne(sourceModel, docToSave, docID) {
    if (!docID) {
        // alert("docID is not defined")
        throw Error("docID is not defined")
    }
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
import store from '../data/store'
import settings from '../data/settings'
import m from 'mithril'
import { db } from './firebaseConfig'


// let db = firebase.firestore();

/**
 * getDoc get a document from specific collection
 * @param {String} col collection name to find doc
 * @param {String} id the doc id to find
 * @return {Promise} return new Promise with DocoumentReference
 */
function getDoc(col, id) {
    let docRef = db.collection(col).doc(id);
    return docRef.get();
}



module.exports = {
    getDoc,
};



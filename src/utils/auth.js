import m from "mithril"

import { googleProvider } from "../firebase/googleProvider"
import { auth, db } from "../index"
import { store } from "../data/store"

export const loginWithGooglePopUp = async () => {
    try {
        await auth.signInWithRedirect(googleProvider)
        const userCred = await auth.getRedirectResult();
        await setUserDoc(userCred);
        await setClientDoc(userCred);
        await setCurrentUser(userCred.user);
    } catch (err) {
        console.error(err)
    }
}

export const loginWithEmail = async (email, password) => {
    try {
        const userCred = await auth.signInWithEmailAndPassword(email, password);
        await setUserDoc(userCred);
        await setClientDoc(userCred);
        await setCurrentUser(userCred.user)
    } catch (err) {
        console.error(err)
        if (err.code === "auth/user-not-found") {
            const userCred = await auth.createUserWithEmailAndPassword(email, password)
            await setUserDoc(userCred);
            await setClientDoc(userCred);
            await setCurrentUser(userCred.user)
        }
    }
}

const setUserDoc = async (userCred) => {
    const userDoc = db.doc(`users/${userCred.user.uid}`);
    if (!(await userDoc.get()).exists) {
        await userDoc.set({
            displayName: userCred.user.displayName,
            email: userCred.user.email,
            photoURL: userCred.user.photoURL
        }, { merge: true });
    }
}

const setClientDoc = async (userCred) => {
    const clientDocRef = db.doc(`clients/${userCred.user.uid}`);
    if (!(await clientDocRef.get()).exists) {
        await clientDocRef.set({
            clientName: userCred.user.displayName,
            clientEmail: userCred.user.email
        }, { merge: true });
    }
}

export const setCurrentUser = async (user) => {
    store.user.displayName = user.displayName
    store.user.email = user.email
    store.user.photoURL = user.photoURL
    const token = await user.getIdToken()
    sessionStorage.setItem("token", token)
    m.route.set("/app/invite");
    m.redraw()
}
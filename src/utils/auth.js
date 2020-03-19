import m from "mithril"

import { googleProvider } from "../firebase/googleProvider"
import { auth, db } from "../index"
import { store } from "../data/store"

export const loginWithGooglePopUp = async () => {
    try {
        const userCred = await auth.signInWithPopup(googleProvider)
        const userDoc = await db.collection("users").doc(userCred.user.uid).set({
            displayName: userCred.user.displayName,
            email: userCred.user.email,
            photoURL: userCred.user.photoURL
        }, { merge: true });

        const clientDocRef = db.collection("clients").doc(userCred.user.uid);
        if (!(await clientDocRef.get()).exists) {
            await clientDocRef.set({
                clientName: userCred.user.displayName,
                clientEmail: userCred.user.email
            }, { merge: true });
        }
        store.user.displayName = userCred.user.displayName
        store.user.email = userCred.user.email
        store.user.photoURL = userCred.user.photoURL
        const token = await userCred.user.getIdToken()
        sessionStorage.setItem("token", token)
        // console.log(store.user)
        m.route.set("/app/invite")
    } catch (err) {
        console.error(err)
    } finally {
        m.redraw();
    }
}
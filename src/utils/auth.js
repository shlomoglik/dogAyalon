import m from "mithril"

import { googleProvider } from "../firebase/googleProvider"
import { auth } from "../index"
import { store } from "../data/store"

export const loginWithGooglePopUp = async () => {
    try {
        const userCred = await auth.signInWithPopup(googleProvider)
        store.user.displayName = userCred.user.displayName
        store.user.email = userCred.user.email
        store.user.photoURL = userCred.user.photoURL
        const token = await userCred.user.getIdToken() //localstorage ? 
        sessionStorage.setItem("token", token)
        // console.log(store.user)
        m.route.set("/app/invite")
    } catch (err) {
        console.error(err)
    }
}
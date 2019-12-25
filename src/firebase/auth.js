import {auth} from '../firebase/firebaseConfig'


const signIn = (email, password) =>{ 
    return auth.signInWithEmailAndPassword(email, password);
}


module.exports = { signIn};


const firebaseConfig = {
  // copy config from firestore
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth(app);
  const db = firebase.firestore();

  module.exports = {auth,db};


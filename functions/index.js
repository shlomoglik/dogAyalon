const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.notifyMeOnUserCreate = functions.firestore.document('users/{user}').onCreate((doc, context) => {
    console.log('new user created', doc);
})

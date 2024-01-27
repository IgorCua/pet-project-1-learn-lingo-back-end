const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
// const admin = require("firebase-admin");
const { serviceAccount } = require("./credentials");

// const serviceAccount = "";
// const firebaseConfig = {
//     apiKey: "AIzaSyBISxAP7xjjd1Jfw9seOevkIEvQ-PROauI",
//     authDomain: "pet-project-1-learnlingo-21c4c.firebaseapp.com",
//     databaseURL: "https://pet-project-1-learnlingo-21c4c-default-rtdb.firebaseio.com",
//     projectId: "pet-project-1-learnlingo-21c4c",
//     storageBucket: "pet-project-1-learnlingo-21c4c.appspot.com",
//     messagingSenderId: "925544374892",
//     appId: "1:925544374892:web:ddb296f7082d0b413c2e49",
//     measurementId: "G-LZ9RLMS0Y4"
// };

// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://pet-project-1-learnlingo-21c4c-default-rtdb.firebaseio.com"
// });

initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://pet-project-1-learnlingo-21c4c-default-rtdb.firebaseio.com"
});

const fireDb = getFirestore();

module.exports = { fireDb };
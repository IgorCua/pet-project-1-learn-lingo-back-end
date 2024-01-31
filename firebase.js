const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
// const {initializeApp, cert} = require('firebase-admin/app');
// const { getDatabase } = require('firebase-admin/database');
const {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
} = process.env

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = {
    db,
    app
}
// // const admin = require("firebase-admin");
// const { serviceAccount } = require("./credentials");

// let app = initializeApp({
//     credential: cert(serviceAccount),
//     databaseURL: "https://pet-project-1-learnlingo-21c4c-default-rtdb.firebaseio.com"
// });

// const fireDb = getDatabase(app);

// module.exports = { fireDb };
const {initializeApp, cert} = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');

const { serviceAccount } = require("./credentials");

let app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://pet-project-1-learnlingo-21c4c-default-rtdb.firebaseio.com"
});

const fireDb = getDatabase(app);

module.exports = { fireDb };
const { HttpError } = require('../helpers/index');
const ctrlWrapper = require('../utils/ctrlWrapper');
const { ref, get, child, getDatabase } = require('firebase/database');
// const { fireDb } = require('../firebase');
const { db, app } = require('../firebase');

const getTeachersList = async (req, res) => {
    // const
    const teachersRef = ref(db);
    const dbRef = ref(getDatabase(app));
    const teachersList = await get(child(dbRef, `/teachers`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val();
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    console.log()
    // const doc = await get(child(teachersRef, '/users').than((snapshot) => {
    //     if(snapshot.exists()){
    //         console.log(snapshot,val());
    //     } else {
    //         console.log('data is not available');
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // }))
    
    // .than((snapshot) => {
    //     if(snapshot.exists()){
    //         console.log(snapshot,val());
    //     } else {
    //         console.log('data is not available');
    //     }
    // }).catch((error) => {
    //     console.log(error);
    // })
    // console.log(doc)
    // console.log(doc.exists());
    // if(!doc.exists()) {
    //     return HttpError(400)
    // }
    console.log()
    // console.log(doc)
    // res.json({
    //     "key": "Hello world",
    //     "teachersList": teachersList
    // })

    res.status(200).send(teachersList);
    // res.status(200).send(doc);
}

module.exports = {
    getTeachersList: ctrlWrapper(getTeachersList)
}
const { HttpError } = require('../helpers/index');
const ctrlWrapper = require('../utils/ctrlWrapper');
// const { 
//   ref, 
//   get, 
//   child, 
//   getDatabase, 
//   startAt, 
//   limitToFirst, 
//   orderByKey, 
//   query
// } = require('firebase/database');

const {
  getDatabase
} = require('firebase-admin/database');

const { fireDb } = require('../firebase');
// const { db, app } = require('../firebase');

// FirebaseDatabase.getInstance(firebaseApp)
//     .getReference("resources")
//     .child(FSeason.key)
//     .orderByKey()
//     .startAt(id)
//     .limit(size)

const getTeachersList = async (req, res) => {
    // const teachersRef = ref(db, '/users');
    // const teachersList = ref(fireDb, '/teachers')
    const doc = await fireDb.ref('/users').orderByKey().startAt('-NobcoVECbDgSVya_YoG').get().then((snapshot) => {
      console.log(snapshot.val());
      return snapshot.val();
    }).catch((error) => {
      console.log(error);
    });
    // const teachersList = await get(child(teachersRef, '/users')).then((snapshot) => {      
    // const teachersList = await get(teachersRef).then((snapshot) => {      
    //   return snapshot.val();  
    // }).catch((error) => {
    //   if (!snapshot.exists()) HttpError(404);

    //   return error;
    // });
    // console.log(doc)
    // res.status(200).send(teachersList);
    res.status(200).send(doc);
}


module.exports = {
    getTeachersList: ctrlWrapper(getTeachersList)
}
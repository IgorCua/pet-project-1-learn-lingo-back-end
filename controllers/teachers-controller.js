const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../utils/index');
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

const { fireDb } = require('../firebase');
// const { db, app } = require('../firebase');

const getTeachersList = async (req, res) => {
    const { id } = req.body;
    const paginationStart = (id.length !== 0) ? id : '-NoIE4Slkr9NCsw2CbRH';

    console.log();

    const doc = await fireDb
        .ref('/teachers')
        .orderByKey()
        .startAt(paginationStart)
        .limitToFirst(5)
        .get()
        .then((snapshot) => {
            const keysArr = Object.keys(snapshot.val());
            let obj = snapshot.val();

            // deleting last object to save it id under id key for pagination
            delete obj[keysArr[keysArr.length - 1]];
            // obj.id = keysArr[keysArr.length - 1];

            // console.log(obj);
            return {list: obj, id : keysArr[keysArr.length - 1]};
        })
        .catch((error) => {
            console.log(error);
        });
    
    res.status(200).send(doc);
}


module.exports = {
    getTeachersList: ctrlWrapper(getTeachersList)
}

const { filterTeachers } = require('../helpers/index');
const { ctrlWrapper } = require('../utils/index');

const { fireDb } = require('../firebase');

const getTeachersList = async (req, res) => {
    const { id } = req.query;
    console.log("REQ", req.data);
    const paginationStart = (id.length !== 0) ? id : '-NoIE4Slkr9NCsw2CbRH';

    console.log("REQ", req.body);

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

            return {list: obj, id : keysArr[keysArr.length - 1], length: keysArr.length - 1};
        })
        .catch((error) => {
            console.log(error);
        });
    
    res.status(200).send(doc);
}

const filter = async (req, res) => {
    const teachersList = await fireDb
        .ref('/teachers')
        .orderByKey()
        .get()
        .then((snapshot) => {
            return filterTeachers(req.body, snapshot.val());
        })
    res.status(200).send(teachersList);
}

module.exports = {
    getTeachersList: ctrlWrapper(getTeachersList),
    filter: ctrlWrapper(filter)
}

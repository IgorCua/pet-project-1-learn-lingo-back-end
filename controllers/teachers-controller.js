const { filterTeachers } = require('../helpers/index');
const { ctrlWrapper } = require('../utils/index');

const { fireDb } = require('../firebase');

const getTeachersList = async (req, res) => {
    const { id } = req.query;
    // console.log("REQ", req.query);
    const paginationStart = (id && id.length !== 0) ? id : '-NoIE4Slkr9NCsw2CbRH';

    const teachersList = await fireDb
        .ref('/teachers')
        .orderByKey()
        .startAt(paginationStart)
        .limitToFirst(5)
        .get()
        .then((snapshot) => {
            const keysArr = Object.keys(snapshot.val());
            let obj = snapshot.val();

            // deleting last object to save it id under id key for pagination
            if(keysArr.length === 5) delete obj[keysArr[keysArr.length - 1]];

            return {list: obj, id : keysArr[keysArr.length - 1], length: keysArr.length - 1};
        })
        .catch((error) => {
            console.log(error);
        });
    
    res.status(200).send(teachersList);
}

const filter = async (req, res) => {
    // console.log(req.query)
    const teachersList = await fireDb
        .ref('/teachers')
        .orderByKey()
        .get()
        .then((snapshot) => {
            return filterTeachers(req.query, snapshot.val());
        })
    res.status(200).send(teachersList);
}

module.exports = {
    getTeachersList: ctrlWrapper(getTeachersList),
    filter: ctrlWrapper(filter)
}

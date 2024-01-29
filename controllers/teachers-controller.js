const { HttpError } = require('../helpers/index');
const ctrlWrapper = require('../utils/ctrlWrapper');
const { fireDb } = require('../firebase');

const getTeachersList = async (req, res) => {
    res.json({"key": "Hello world"})
}

module.exports = {
    getTeachersList: ctrlWrapper(getTeachersList)
}
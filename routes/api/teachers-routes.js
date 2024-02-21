const express = require('express');
const { 
    getTeachersList,
    filter
} = require('../../controllers/teachers-controller');

const router = express.Router();

router.get('/teachers', getTeachersList);
router.get('/filter', filter);

module.exports = router;
const express = require('express');
const { 
    getTeachersList,
    filter
} = require('../../controllers/teachers-controller');

const router = express.Router();

router.get('/teachers', getTeachersList);
router.get('/teachers/filter', filter);

module.exports = router;
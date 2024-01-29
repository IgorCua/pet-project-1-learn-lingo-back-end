const express = require('express');
const { 
    getTeachersList 
} = require('../../controllers/teachers-controller');

const router = express.Router();

router.get('/teachers', getTeachersList);

module.exports = router;
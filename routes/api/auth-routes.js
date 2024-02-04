const express = require('express');
const { 
    register
} = require('../../controllers/auth-controller');
const { userRegisterSchema, userLoginSchema } = require('../../schemas/index');
const { validateBody } = require('../../utils');


const router = express.Router();

router.post('/register', validateBody(userRegisterSchema), register);
router.post('/login', );
router.post('/logoff', );

module.exports = router;
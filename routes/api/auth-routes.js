const express = require('express');
const { 
    register,
    login
} = require('../../controllers/auth-controller');
const { userRegisterSchema, userLoginSchema } = require('../../schemas/index');
const { validateBody } = require('../../utils');


const router = express.Router();

router.post('/register', validateBody(userRegisterSchema), register);
router.post('/login', validateBody(userLoginSchema), login);
router.post('/logoff', );
router.post('/favorites', );

module.exports = router;
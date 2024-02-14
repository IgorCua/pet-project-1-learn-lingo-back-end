const express = require('express');
const { 
    register,
    login,
    logout,
    favorites
} = require('../../controllers/auth-controller');
const { userRegisterSchema, userLoginSchema } = require('../../schemas/index');
const { validateBody } = require('../../utils');
const authenticate = require('../../middlewares/authenticate');


const router = express.Router();

router.post('/register', validateBody(userRegisterSchema), register);
router.post('/login', validateBody(userLoginSchema), login);
router.post('/logout', authenticate, logout);
router.post('/favorites', favorites);

module.exports = router;
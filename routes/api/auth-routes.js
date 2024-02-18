const express = require('express');
const { 
    register,
    login,
    logout,
    favorites,
    favoritesUpdate
} = require('../../controllers/auth-controller');
const { userRegisterSchema, userLoginSchema } = require('../../schemas/index');
const { validateBody } = require('../../utils');
const authenticate = require('../../middlewares/authenticate');


const router = express.Router();

router.post('/register', validateBody(userRegisterSchema), register);
router.post('/login', validateBody(userLoginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/favorites', authenticate, favorites);
router.post('/favorites/update-list', authenticate, favoritesUpdate);


module.exports = router;
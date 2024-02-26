const { HttpError } = require("../helpers");
const jwt = require('jsonwebtoken');
const { fireDb } = require('../firebase');
const { SECRET_KEY } = process.env;

const authenticate = async (req, _, next) => {
    const { authorization = '' } = req.headers;
    const [ bearer, token ] = authorization.split(' ');
    if(bearer !== "Bearer"){
        next(HttpError(401, 'Unauthorized'));
    }

    try{
        const { email, id } = jwt.verify(token, SECRET_KEY);
        const user = (await fireDb.ref('/users').child(id).get()).val();
        
        if(!user || !token || email !== user.email) next(HttpError(401, 'Unauthorized'))
        
        next();
    } catch (error) {
        next(HttpError(401, 'Unauthorized'));
    }
}

module.exports = authenticate;
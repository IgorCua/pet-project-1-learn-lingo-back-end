const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../utils/index');
const { fireDb } = require('../firebase');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const {
  getDatabase
} = require('firebase-admin/database');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    
    const user = await fireDb
        .ref('/users')
        .orderByChild('email')
        .equalTo(email.toLowerCase())
        .get()
    
    if(user.val()) throw HttpError(409, 'Email is already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    await fireDb.ref('/users').child(nanoid()).set(
        {
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            favorites: "",
            token: ""
        }
    )

    res.status(201).json({
        user: email,
        message: 'user created'
    })
}

const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await fireDb
        .ref('/users')
        .orderByChild('email')
        .equalTo(email.toLowerCase())
        .get()
        .then((snapshot) => {
            return snapshot.val();
        })
        .catch((error) => {
            console.log(error)
        })
    
    const userPassword = user[Object.keys(user)].password;
    const userID = Object.keys(user).join('');

    if(!user) throw HttpError(401, 'Email or password is wrong.');
    // if(!user.verify) throw HttpError(401, 'Please verify your email to login');
    
    const passwordCompareResult = await bcrypt.compare(password, userPassword);

    if(!passwordCompareResult) throw HttpError(401, 'Email or password is wrong');

    const payload = {
        id: userID,

    }
    
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '3h'});

    await fireDb
        .ref('/users')
        .child(userID)
        .update({token: token})

    res.json({
        token,
        user: {
            id: userID,
            email: email,
        }
    });
}

const logout = async (req, res) => {
    const { id } = req.body;
    
    await fireDb
        .ref('/users')
        .child(id)
        .update({token: ''})

    res.status(204).json();
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout)
}
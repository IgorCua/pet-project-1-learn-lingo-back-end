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
    // const {} = user
    // console.log(userObj);
    // console.log(user[Object.keys(user)].password)

    // console.log(user.verify)

    if(!user) throw HttpError(401, 'Email or password is wrong.');
    // if(!user.verify) throw HttpError(401, 'Please verify your email to login');
    
    const passwordCompareResult = await bcrypt.compare(password, userPassword);

    if(!passwordCompareResult) throw HttpError(401, 'Email or password is wrong');

    const payload = {
        id: userID,

    }
        // console.log(nanoid())
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '3h'});

    await fireDb
        .ref('/users')
        .child(userID)
        // .get()
        // .then((snapshot) => {
        //     console.log(snapshot.val())
        // })
        .update({token: token})

    res.json({
        token,
        user: {
            email: email,
        }
    });
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login)
}
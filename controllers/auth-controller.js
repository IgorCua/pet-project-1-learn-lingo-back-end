//
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
        }
    )

    res.status(201).json({
        user: {
            name: name,
            email: email,
        },
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
    
    const userObj = user[Object.keys(user)];
    const userID = Object.keys(user).join('');

    if(!user) throw HttpError(401, 'Email or password is wrong.');
    // if(!user.verify) throw HttpError(401, 'Please verify your email to login');
    
    const passwordCompareResult = await bcrypt.compare(password, userObj.password);

    if(!passwordCompareResult) throw HttpError(401, 'Email or password is wrong');

    const payload = {
        id: userID,
        email: userObj.email,
    }
    
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '3h'});

    // await fireDb
    //     .ref('/users')
    //     .child(userID)
    //     .update({token: token})

    res.json({
        token,
        user: {
            id: userID,
            name: userObj.name,
            email: userObj.email,
        }
    });
}

const logout = async (req, res) => {
    // const { id } = req.body;
    // console.log(req)
    console.log(req.body)
    console.log(req.headers)
    // await fireDb
    //     .ref('/users')
    //     .child(id)
    //     .update({token: ''})

    res.status(200).json({token: null});
    // res.status(204).json({token: "null"});
}

const favorites = async (req, res) => {
    const {userID, teacherID} = req.body;
    let userFavoritesArr;
    let isFavorite;

    const user = await fireDb
        .ref('/users')
        .orderByKey()
        .equalTo(userID)
        .get((snapshot) => {
            return snapshot.val();
        })
    
    if (!user) throw HttpError(404, 'User not found');

    const userFavorites = user.val()[userID].favorites;
    
    if ( userFavorites.length > 0) {
        console.log(true)
        userFavoritesArr = userFavorites.split(',');
        isFavorite = userFavoritesArr.every((curr) => curr === teacherID);
    };
    
    if (userFavorites.length === 0) {
        const test = await fireDb
            .ref('/users')
            .child(userID)
            .update({
                'favorites': teacherID
            })

        console.log(test);
    }
    // console.log(userFavoritesArr.length);
    
    console.log("userFavorites", userFavorites);
    console.log("userFavoritesArr", userFavoritesArr);
    console.log("isFavorite", isFavorite);
    res.status(200).send(user);
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    favorites: ctrlWrapper(favorites)
}
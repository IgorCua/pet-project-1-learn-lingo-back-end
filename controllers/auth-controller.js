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
            console.log("USER", snapshot.val())
            return snapshot.val();
        })
        .catch((error) => {
            console.log(error)
        })

    if(!user) throw HttpError(401, 'Email or password is wrong.');
    
    const userObj = user[Object.keys(user)];
    const userID = Object.keys(user).join('');
    
    const passwordCompareResult = await bcrypt.compare(password, userObj.password);

    if(!passwordCompareResult) throw HttpError(401, 'Email or password is wrong.');

    const payload = {
        id: userID,
        email: userObj.email,
    }
    console.log("TEST", payload)
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '3h'});

    res.json({
        token,
        user: {
            id: userID,
            name: userObj.name,
            email: userObj.email,
            favorites: userObj.favorites
        }
    });
}

// const logout = async (req, res) => {
//     res.status(200).json({token: null});
// }

const favorites = async (req, res) => {
    const { userID } = req.query;
    let resObj = {};

    const userFavorites = await fireDb
        .ref('/users')
        .orderByKey()
        .equalTo(userID)
        .get()
        .then((snapshot) => {
            return snapshot.val()[userID].favorites;
        })
   
    await Promise.all(userFavorites.split(', ').map( async (userID) => {
        const teacher = await fireDb
            .ref('/teachers')
            .orderByKey()
            .equalTo(userID.trim())
            .once('value')
            .then((snapshot) => {
                return snapshot.val()[userID];
            })  
            
        resObj[userID] = teacher;
    }))

    res.status(200).send(resObj);
}

const favoritesUpdate = async (req, res) => {
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
    
    if (userFavorites.length === 0) {
        await fireDb
            .ref('/users')
            .child(userID)
            .update({
                'favorites': teacherID
            })
    }

    if ( userFavorites.length > 0) {
        userFavoritesArr = userFavorites.split(', ');
        isFavorite = userFavoritesArr.find((curr) => curr === teacherID);
        
        if(!isFavorite) {
            userFavoritesArr.push(teacherID);
            await fireDb
                .ref('/users')
                .child(userID)
                .update({
                    'favorites': userFavoritesArr.join(', ')
                })
        }
    
        if(isFavorite) {
            userFavoritesArr.splice(userFavoritesArr.indexOf(teacherID), 1);
            
            await fireDb
                .ref('/users')
                .child(userID)
                .update({
                    'favorites': userFavoritesArr.join(', ')
                })
        }
    };
    
    res.status(200).send(userFavoritesArr.join(', '));
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    // logout: ctrlWrapper(logout),
    favorites: ctrlWrapper(favorites),
    favoritesUpdate: ctrlWrapper(favoritesUpdate)
}
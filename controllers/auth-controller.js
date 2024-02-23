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
            favorites: userObj.favorites
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
    const { userID } = req.query;
    // const { userID } = req.body;
    // console.log("USER_ID", userID);
    // console.log("body", req.body)
    // console.log("query", req.query)
    // console.log("params", req.params)
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
    // const responce = {"-NoIE4Slkr9NCsw2CbRH": {
    //     "avatar_url": "https://ftp.goit.study/img/avatars/1.jpg",
    //     "conditions": [
    //         "Teaches only adult learners (18 years and above).",
    //         "Flexible scheduling options available."
    //     ],
    //     "experience": "John has been teaching languages for 7 years and has extensive experience in helping students improve their language skills. He has successfully taught numerous students from different backgrounds and proficiency levels.",
    //     "languages": [
    //         "English",
    //         "Spanish"
    //     ],
    //     "lesson_info": "The lessons focus on improving speaking and listening skills through interactive activities and discussions.",
    //     "lessons_done": 1375,
    //     "levels": [
    //         "A1 Beginner",
    //         "A2 Elementary",
    //         "B1 Intermediate",
    //         "B2 Upper-Intermediate",
    //         "C1 Advanced",
    //         "C2 Proficient"
    //     ],
    //     "name": "John",
    //     "price_per_hour": 25,
    //     "rating": 4.5,
    //     "reviews": [
    //         {
    //             "comment": "John is an excellent teacher! I highly recommend him.",
    //             "reviewer_name": "Alice",
    //             "reviewer_rating": 5
    //         },
    //         {
    //             "comment": "John is very knowledgeable and patient. I enjoyed his classes.",
    //             "reviewer_name": "Bob",
    //             "reviewer_rating": 4
    //         }
    //     ],
    //     "surname": "Doe"
    // }}
    // res.status(200).send(responce);
    res.status(200).send(resObj);
}

const favoritesUpdate = async (req, res) => {
    const {userID, teacherID} = req.body;
    // const {userID, teacherID} = req.query;
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
    logout: ctrlWrapper(logout),
    favorites: ctrlWrapper(favorites),
    favoritesUpdate: ctrlWrapper(favoritesUpdate)
}
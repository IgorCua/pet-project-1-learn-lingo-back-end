const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../utils/index');
const { fireDb } = require('../firebase');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

const {
  getDatabase
} = require('firebase-admin/database');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    // console.log(email)
    const user = await fireDb
        .ref('/users')
        .orderByChild('email')
        .equalTo(email.toLowerCase())
        .get()
    console.log(user.val())
    
    if(user.val() !== null) throw HttpError(409, 'Email is already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    await fireDb.ref('/users').child(nanoid()).set(
        {
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            token: ""
        }
    )

    // userCreate
    // res.status(201).send(user)
    // console.log(userCreate)
    res.status(201).json({
        user: email,
        message: 'user created'
    })
}

module.exports = {
    register: ctrlWrapper(register)
}
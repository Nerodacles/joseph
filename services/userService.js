const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const auth = require('../helpers/jwt.js')

async function login({ username, password }) {
    const user = await User.findOne({username});

    // synchronously compare user entered password with hashed password
    if(bcrypt.compareSync(password, user.password)){
        // Generate a token
        const token = auth.generateAccessToken(username);

        // call toJSON method applied during model instantiation
        return {...user.toJSON(), token}
    }
    return 'err'
}

async function register(params){
    // instantiate a user modal and save to mongoDB
    const user = new User(params);
    await user.save();
    // call toJSON method applied during model instantiation
    return user.toJSON();
}

async function getAll() {
    // find all users in mongoDB
    return User.find({})
}

async function getById(id) {
    const user = await User.findById(id);
    // call toJSON method applied during model instantiation
    return user.toJSON()
}

async function checkUserIsAdmin(token){
    if (!token){
        return false
    }
    let user = await auth.getUserRole(token)
    if (user.role === 'admin') {
        console.log('user is admin')
        return true
    }
    return false
}

module.exports = {
    login,
    register,
    getAll,
    getById,
    checkUserIsAdmin
};
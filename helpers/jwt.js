const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Model = require('../models/userModel')

// get password lets from .env file
dotenv.config();

function authenticateToken(req, res, next) {
    const token = req.headers.authorization

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

function verifyToken(token) {
    try {
        // if token is older than 1h, return false and delete token
        jwt.verify(token, process.env.TOKEN_SECRET, {maxAge: '5d'})
        return true
    } catch (err) {
        return false
    }
}

function getUserByToken(token) {
    return jwt.verify(token, process.env.TOKEN_SECRET, {maxAge: '5d'})
}

function getUserRole(token) {
    let tokenData = jwt.verify(token, process.env.TOKEN_SECRET, {maxAge: '5d'})
    if (tokenData) {
        let user = Model.findOne({username: tokenData.data})
        return user
    }
}

function generateAccessToken(username) {
    return jwt.sign({data: username}, process.env.TOKEN_SECRET, { expiresIn: '7d' });
}

module.exports = {
    generateAccessToken,
    authenticateToken,
    verifyToken,
    getUserByToken,
    getUserRole
}
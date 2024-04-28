require('dotenv').config();

const bcrypt = require("bcryptjs");

const handleError = require('../midlleware/handleError');
const User = require("../model/users.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const genrateJWT = require('../utils/genrateJWT');

const getAllUsers = handleError(async (req, res) => {
    // console.log(req.headers);
    const query = req.query;
    const limit = query.limit || 100;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const users = await User.find({}, {"__v": false, "password": false}).limit(limit).skip(skip);

    res.status(200).json({"status": httpStatusText.SUCCESS, "data": {users}});
})

const register = handleError(async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.file);
    const {firstName, lastName, email, password, role} = req.body;

    const oldUser = await User.findOne({"email": email});

    if(oldUser) {
        const error = appError.create("User already exists", 400, httpStatusText.FAIL);
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    });
    
    const token = await genrateJWT({"email": newUser.email, "id": newUser._id, "role": newUser.role});
    newUser.token = token;

    await newUser.save();

    res.status(201).json({"status": httpStatusText.SUCCESS, "data": {newUser}});
})

const login = handleError(async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        const error = appError.create("Email and Password are required", 400, httpStatusText.ERROR);
        return next(error);
    }

    const user = await User.findOne({"email": email});
    if(!user) {
        const error = appError.create("User Not Found", 404, httpStatusText.FAIL);
        return next(error);
    }
    const matchPassword = await bcrypt.compare(password, user.password);

    if(user && matchPassword) {
        const token = await genrateJWT({"email": user.email, "id": user._id, "role": user.role});

        res.status(200).json({"status": httpStatusText.SUCCESS, "data": {token}});
    } else if(!matchPassword) {
        const error = appError.create("Password is wrong", 404, httpStatusText.ERROR);
        return next(error);
    }
})

module.exports = {
    getAllUsers,
    register,
    login
}
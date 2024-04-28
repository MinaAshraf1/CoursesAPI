const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'field must be a valid email']
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRoles.MANGER, userRoles.ADMIN, userRoles.USER],
        default: userRoles.USER
    },
    avatar: {
        type: String,
        default: "uploads/car.png"
    }
});

module.exports = mongoose.model('User', userSchema);
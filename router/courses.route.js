let express = require("express");
let courseController = require('../controller/courses.controller');
const {validation} = require("../midlleware/validation");
const verifyToken = require('../midlleware/verifyToken');
const allowedTo = require("../midlleware/allowedTo");
const userRoles = require("../utils/userRoles");

let router = express.Router();

router.route('/')
    .get(courseController.getAllCourses)
    .post(verifyToken, validation(), allowedTo(userRoles.MANGER), courseController.addCourse);

router.route('/:id')
    .get(courseController.getCourse)
    .patch(verifyToken, allowedTo(userRoles.MANGER), courseController.updateCourse)
    .delete(verifyToken, allowedTo(userRoles.MANGER),courseController.deleteCourse);

module.exports = router;
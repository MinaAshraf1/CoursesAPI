let {validationResult} = require("express-validator");
let Course = require("../model/courses.model");
let httpStatusText = require("../utils/httpStatusText");
let handleError = require('../midlleware/handleError');
let appError = require('../utils/appError');


let getAllCourses = handleError(
    async(req, res) => {
        const query = req.query;
        // console.log(query);
        let limit = query.limit || 10;
        let page = query.page || 1;
        let skip = (page - 1) * limit;
        const courses = await Course.find({}, {"_v": false}).limit(limit).skip(skip);
        // console.log(courses);
        res.status(200).json({"status": httpStatusText.SUCCESS, "data": {courses}});
    }
);

let getCourse = handleError(
    async (req, res, next) => {
        const id = req.params.id;
        let course = await Course.findById(id);
        if(!course) {
            // const error = new Error();
            // error.message = "Course Not Found";
            // error.statusCode = 404;
            const error = appError.create("Course Not Found", 404, httpStatusText.FAIL);
            return next(error);
            // return res.status(404).json({"status": httpStatusText.FAIL, "data": {"course": null}});
        }
        res.status(200).json({"status": "sucsess", "data": {course}});
        // try {
        // } catch(e) {
        //     return res.status(400).json({"status": httpStatusText.ERROR, "data": null, "message": e.message, "code": 400});
        // }
    }
);

let addCourse = handleError(
    async (req, res, next) => {
        let errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()) {
            const error = appError.create(errors.array(), 404, httpStatusText.FAIL);
            return next(error);
            // return res.status(400).json({"status": httpStatusText.FAIL, "data": errors.array()});
        }
        const course = new Course(req.body);
        await course.save();
        console.log(course);
        res.status(201).json({"status": httpStatusText.SUCCESS, "data": {course}});
    }
);

let updateCourse = handleError(
    async (req, res) => {
        const id = req.params.id;
        let course = await Course.updateOne({"_id": id}, {$set: {...req.body}});
        if(!course) {
            const error = appError.create("Course Not Found", 404, httpStatusText.FAIL);
            return next(error);
            // return res.status(404).json({"status": httpStatusText.FAIL, "data": null});
        }
        res.status(200).json({"status": httpStatusText.SUCCESS, "data": {course}});
        // try {
        // } catch(e) {
        //     return res.status(404).json({"status": httpStatusText.ERROR, "message": e.message});
        // }
    }    
);

let deleteCourse = handleError(
    async (req, res) => {
        const id = req.params.id;
        await Course.deleteOne({"_id": id})
        res.status(200).json({"status": httpStatusText.SUCCESS, "data": null});
        // try {
        // } catch(e) {
        //     return res.status(404).json({"status": httpStatusText.ERROR, "message": e.message});
        // }
    }
);

module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
}
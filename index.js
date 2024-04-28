require("dotenv").config();
let express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');
let courseRouter = require('./router/courses.route');
let userRoute = require("./router/users.route");
let httpStatusText = require('./utils/httpStatusText');
const { log } = require("console");

url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
    console.log("mongoose connect successfuly");
})

// console.log(process.env);

let app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, 'uploads')))

app.use('/api/courses', courseRouter);
app.use('/api/users', userRoute);

app.all('*', (req, res, next) => {
    return res.status(404).json({"status": httpStatusText.ERROR, "message": "URL Not Found"})
})

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        "status": error.statusText || httpStatusText.ERROR,
        "message": error.message,
        "code": error.statusCode || 500,
        "data": null
    });
})

app.listen(process.env.PORT || 2000, () => {
    console.log("server listen in port 2000");
})
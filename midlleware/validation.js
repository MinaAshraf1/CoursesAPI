let {body} = require("express-validator");

let validation = () => {
    return [
        body("title")
            .notEmpty()
            .withMessage("title is require")
            .isLength({min: 3})
            .withMessage("title should be more than 3 digts"),
        body('price')
            .notEmpty()
            .withMessage("price is require")
    ]
}

module.exports = {validation};
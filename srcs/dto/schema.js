const joi = require('joi');

module.exports.userLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

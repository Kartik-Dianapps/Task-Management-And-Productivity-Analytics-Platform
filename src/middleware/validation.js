const Joi = require("joi");

exports.registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().required(),
    role: Joi.string()
        .valid("user", "manager", "admin") // only these values are allowed
        .default("user") // default to "user" if not provided
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});


exports.updateProfileSchema = Joi.object({
    fullName: Joi.string().optional(),
    designation: Joi.string().optional(),
    avatar: Joi.string().uri().optional()
});
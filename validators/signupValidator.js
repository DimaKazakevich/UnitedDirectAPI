const {check, validationResult} = require('express-validator');
const users = require('../domain/models').models.users

exports.validateUser = [
    check('password')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Password can not be empty!')
        .bail()
        .not()
        .isIn(['123456', 'password', 'qwerty'])
        .withMessage('Do not use a common word as the password')
        .bail()
        .isLength({min: 6, max: 16})
        .withMessage('Password must be 6-16 characters')
        .bail(),
    check('email')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Email can not be empty!')
        .bail()
        .isEmail()
        .withMessage('Invalid email address')
        .bail()
        .custom(value => {
            return users.count({where: {email: value}})
                .then(count => {
                    if (count !== 0) {
                        return Promise.reject('E-mail already in use');
                    }
                })
        })
        .bail(),
    check('passwordConfirmation')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Password confirmation can not be empty!')
        .bail()
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation and password do not match');
            }

            return true;
        })
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array()});
        next();
    },
];

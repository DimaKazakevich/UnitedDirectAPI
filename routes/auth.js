const express = require('express')
const authRouter = express.Router()
const authController = require('../controllers/authController')
const {validateUser} = require('../validators/signupValidator')

authRouter.route('/api/auth/sign-up').post(validateUser, authController.signup)
authRouter.post('/api/auth/sign-in', authController.signin)

module.exports = authRouter
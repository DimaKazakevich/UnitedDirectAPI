let authService = require('../services/authService')

module.exports = {
    signin: (req, res) => {
        authService.signin(req, res);
    },
    signup: (req, res) => {
        authService.singup(req, res);
    }
}
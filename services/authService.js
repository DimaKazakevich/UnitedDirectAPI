const users = require('../domain/models').models.users
const userRoles = require('../domain/models').models.userRoles
const roles = require('../domain/models').models.roles
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY, SALT_ROUNDS} = require('../config/envConfig')
const bcrypt = require("bcrypt");

module.exports = {
    signin: async (req, res) => {
        const {email, password} = req.body;

        let user = await users.findOne({
            where: {
                email: email
            }
        });

        bcrypt.compare(password, user.password, (err, matched) => {
            if (matched) {
                const accessToken = jwt.sign({email: user.email}, JWT_SECRET_KEY);

                res.json({
                    email: user.email,
                    accessToken
                });
            }
            res.status(401).send('Email or password incorrect');
        });
    },
    singup: async (req, res) => {
        const body = req.body;
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        body.password = await bcrypt.hash(body.password, salt);
        users.create(body).then((createdUser) => {
            roles.findOne({
                where: {
                    name: 'ROLE_USER'
                }
            }).then((role) => {
                userRoles.create({
                    roleId: role.id,
                    userId: createdUser.id
                })
            });
            return createdUser;
        }).then((createdUser) => {
            res.status(201).send({
                id: createdUser.id,
                email: createdUser.email
            })
        });
    }
}
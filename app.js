const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const roles = require('./domain/models').models.roles

let authRouter = require('./routes/auth')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', authRouter);

app.listen(3000, () => {
    roles.count({where: {name: 'ROLE_USER'}})
        .then(count => {
            if (count === 0) {
                roles.create({name: 'ROLE_USER'});
            }
        })
    roles.count({where: {name: 'ROLE_ADMIN'}})
        .then(count => {
            if (count === 0) {
                roles.create({name: 'ROLE_ADMIN'});
            }
        })
})

module.exports = app;

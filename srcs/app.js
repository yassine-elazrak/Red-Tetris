
const router = require('./routes')
const dotenv = require("dotenv").config()
const express = require('express');
const swaggerUi = require('swagger-ui-express')
// const swaggerFile = require('./swagger_output.json')
const {UsersService} = require('./users/user.service')
const app = express();
const logger = require('morgan');


module.exports.createApp = () => {
    console.log('app up ')
    app.use(logger('dev'));
    app.use(express.json());
    app.use(router)
    // app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    return app;
};
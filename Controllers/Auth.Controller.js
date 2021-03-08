require('dotenv').config();
/* Load npm node modules */
const moment = require('moment-timezone');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const createError = require('http-errors');
const crypto = require('crypto');
const geoip = require('geoip-lite');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

/* Load own modules */
// const validationList = require('../helpers/validationSchema');
// const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../Middleware/jwtAuth');
// const client = require('../config/redisClientConfig');
// const passHelper = require('../helpers/passHelper');
// const addJob = require('../helpers/addJob');
// const constants = require('../helpers/constants');

//load DB models

module.exports = {
    test_worker: (req, res) => {

        return res.send({
            status: 200,
            msg: "testing worker queue.",
        });
    },
}
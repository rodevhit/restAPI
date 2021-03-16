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
const {authSchema} = require('../helper/validationSchema');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../Middleware/jwtAuth');
const client = require('../config/redisClientConf');

//load DB models
const User = require('../Models/User.model');

module.exports = {
    test_worker: (req, res) => {

        return res.send({
            status: 200,
            msg: "testing worker queue.",
        });
    },
    register: async (req, res, next) => {
        try {
            const { email, password, firstname, lastname, invitation_code } = req.body;
            // if (!email || !password) throw createError.BadRequest()
            const result = await authSchema.validateAsync({email, password});

            const doesExist = await User.findOne({ email: result.email });
            if (doesExist)
                throw createError.Conflict(`${result.email} is already been registered`);
            
            const sendObj = {
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname,
                invitation_code: invitation_code
            }
            const user = new User(sendObj);
            const savedUser = await user.save();

            res.send({ 
                status: 200,
                message: 'New user registered successfully',
            })
        } catch (error) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },
    
    login: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body);
            const user = await User.findOne({ email: result.email });
            if (!user) throw createError.NotFound('User not registered');

            const isMatch = await user.isValidPassword(result.password);
            if (!isMatch)
            throw createError.Unauthorized('Username/password not valid');

            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id);

            res.send({ 
                status: 200,
                message: 'Login success.',
                accessToken,
                refreshToken
            });
        } catch (error) {
            if (error.isJoi === true);
            return next(createError.BadRequest('Invalid Username/Password'));
            next(error)
        }
    },
    
    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw createError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);

            const accessToken = await signAccessToken(userId);
            const refToken = await signRefreshToken(userId);
            res.send({ 
                accessToken: accessToken,
                refreshToken: refToken
            });
        } catch (error) {
            next(error)
        }
    },
    
    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw createError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);
            client.DEL(userId, (err, val) => {
                if (err) {
                    console.log(err.message);
                    throw createError.InternalServerError();
                }
                console.log(val);
                res.sendStatus(204);
            });
        } catch (error) {
            next(error);
        }
    },
}
const JWT = require('jsonwebtoken');
const MobileDetect = require('mobile-detect');
const createError = require('http-errors');
const client = require('../config/redisClientConf');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY}s`,
                issuer: 'RODEVHIT',
                audience: [userId],
            }
            console.log(options);
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    return
                }
                resolve(token)
            })
        })
    },
    verifyAccessTokenDeprecated: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message =
                    err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (req.cookies._tkn1171 == '' || req.headers['authorization'] == '') return next(createError.Unauthorized())
        let token = '';
        if (req.headers['authorization']) {
            const authHeader = req.headers['authorization'];
            const bearerToken = authHeader.split(' ');
            token = bearerToken[1];
        }
        if (req.cookies._tkn1171) {
            token = req.cookies._tkn1171;
        }
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message =
                    err.name === 'JsonWebTokenError' ? 'Invalid token or token has been expired.' : err.message
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        });
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY}s`,
                issuer: 'Netarby',
                audience: [userId],
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    reject(createError.InternalServerError())
                }
                client.SET(userId, token, (err, reply) => {
                    if (err) {
                        reject(createError.InternalServerError())
                        return
                    }
                    client.expire(userId, 365 * 24 * 60 * 60, (err, reply) => {
                        if (err) {
                            reject(createError.InternalServerError())
                            return
                        }
                    })
                    resolve(token)
                })
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, payload) => {
                    if (err) return reject(createError.Unauthorized())
                    const userId = payload.aud
                    client.GET(userId, (err, result) => {
                        if (err) {
                            reject(createError.InternalServerError())
                            return
                        }
                        if (refreshToken === result) return resolve(userId)
                        reject(createError.Unauthorized())
                    })
                }
            )
        })
    },
}
"use strict";
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../Middleware/jwtAuth');

//load controllers
const AuthController = require('../Controllers/Auth.Controller');


/**
 * @swagger
 *
 * /auth/test_worker:
 *   get:
 *     tags:
 *       - Test
 *     description: testing worker queue
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: User's ID.
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: testing worker queue
 */
router.get('/test_worker', AuthController.test_worker);

/**
 * @swagger
 *
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     description: Register the user in the Application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email or Phone number (enter mobile number with country code)
 *         in: formData
 *         required: true
 *         type: string
 *         format: email
 *       - name: password
 *         description: Password of the customer
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *       - name: firstname
 *         description: Firstname of the customer
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastname
 *         description: Lastname of the customer
 *         in: formData
 *         required: true
 *         type: string
 *       - name: invitation_code
 *         description: Send the unique invitation code if any
 *         in: formData
 *         required: false
 *         type: string
 *         format: password
 *     responses:
 *       200:
 *         description: New user has been successfully registered with Netarby.
 *       403: 
 *         description: You do not have necessary permissions to create new user or register.
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * 
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Login user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: email
 *         description: User's EMAIL-ID (username).
 *         required: true
 *         type: string
 *         format: email
 *       - in: formData
 *         name: password
 *         description: User's password.
 *         required: true
 *         type: string
 *         format: password
 *     responses:
 *       200:
 *         description: User has been logged-in successfully and a new token has been generated
 *       403: 
 *         description: You do not have necessary permissions to login
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * 
 * /auth/logout:
 *   delete:
 *     tags:
 *       - Auth
 *     description: Logout user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: refreshToken
 *         description: Send the refresh token
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User has been logged-in successfully and a new token has been generated
 *       403: 
 *         description: You do not have necessary permissions to login
 */
router.delete('/logout', AuthController.logout);


module.exports = router;
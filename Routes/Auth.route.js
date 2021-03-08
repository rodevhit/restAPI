"use strict";
require('dotenv').config();
const express = require('express');
const router = express.Router();
// const { verifyAccessToken } = require('../Middleware/jwtAuth');

//load controllers
const CustomerAuthController = require('../Controllers/Auth.Controller');


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
router.get('/test_worker', CustomerAuthController.test_worker);

module.exports = router;
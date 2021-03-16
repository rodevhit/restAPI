require('dotenv').config();
const http = require('http');
const https = require('https');
const express = require('express');
const useragent = require('express-useragent');
const morgan = require('morgan');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const fs = require('fs');
const helmet = require("helmet");

/* Load Swagger configuration file */
const SwaggerConfigOption = require('./config/swaggerConfig');

const app = express();

var whitelist = process.env.ORIGIN_APP_URL;
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS, this site ${origin} does not have an access. Only specific domains are allowed to access it.`));
        }
    },
    credentials: true
}

app.use(cors(corsOptions));
app.use(useragent.express());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(helmet());

// Initialize DB
require('./config/dbInit')();

/* Load the routes */
const AuthRoute = require('./Routes/Auth.route');

/* use the route */
app.use('/auth', AuthRoute);

// console.log(SwaggerConfigOption);
/* swagger declaration */
const specs = swaggerJsdoc(SwaggerConfigOption);
const swaggerUi = require('swagger-ui-express');
app.use('/rest-api-doc', swaggerUi.serve, swaggerUi.setup(specs));
/* swagger declaration */

/* http server */
const httpPort = process.env.HTTP_PORT || 8000;
const httpServer = http.createServer(app);
/* http server */

app.get('/', async(req, res, next) => {
    res.send('Looking for default route.');
});

/* Error Handler */
app.use(async(req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: err.status || 500,
        message: err.message
    });
});
/* Error Handler */

httpServer.listen(httpPort, () => {
    console.log(`HTTP-Server started on port ${httpPort} `);
});
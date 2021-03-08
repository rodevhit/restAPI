/* swagger definition and configuration */
module.exports = {
    swaggerDefinition: {
        // Like the one described here: https://swagger.io/specification/#infoObject
        info: {
            "title": 'Rest API',
            "version": '1.0.0',
            "description": 'Rest API with autogenerated swagger documentation for calling each API with their response.',
        },
        schemes: [
            "http",
            "https"
        ],
        securityDefinitions: {
            BearerAuth: {
                type: "apiKey",
                description: "Type keyword 'Bearer' followed by a space and then enter your Token",
                in: "header",
                name: "Authorization"
            }
        },
        tags: [{
            name: "Auth",
            description: "Authentication with Rest API application.",

        }]
    },
    // List of files(routes) to be processed.
    apis: ['./Routes/Auth.route.js'],
};
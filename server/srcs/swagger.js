const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
        version: "1.0.0",
        title: "api-auth",
        description: "Documentation api auth."
    },
    host: "localhost:5000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Auth",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        apiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "x-access-token",
            description: "any description..."
        }
    },
    definitions: {
        token: {
            "success": true,
            "x-access-token": "sLmNvbSIsInBOjE2MzMxOTE2MDQsImV41dfsdsf5df454DFDFd5d"
        },
        responseUser: {
            "email": "yassine@gemail.com",
            "password": "hjdhjhjksjdsa524545djfhd",
            "role": ["USER", "ADMIN", "AGENCE", "BANK"],
            "refBy": "5"
        },
        login: {
            "email": "yassine@gmail.com",
            "password": "hjdhjhdjfhd"
        },
        responseLogin: {
            $ref: '#/definitions/token'
        },
        register: {
            "email": "yassine@gemail.com",
            "password": "hjdhjhdjfhd",
            "role": ["USER", "ADMIN", "AGENCE", "BANK"]
        },
        createUser: {
            "email": "yassine@gemail.com",
            "password": "hjdhjhdjfhd"
        },
        responseRegister: {
            $ref: '#/definitions/token'
        },
        request: {
            "type": ["ESTIMATE", "ANNONCE", "LOCALISATION", "ESTIMATERAPPORT", "ANNONCERAPPORT", "LOCALISATIONRAPPORT"],
        },
        responseRequest: {
            "success": true
        },
        responseValidateToken: {
            "success": true
        },
        responseAllUser: {
            "data": [{
                "email": "yassine@gemail.com",
                "password": "hjdhjhjksjdsa524545djfhd",
                "role": ["USER", "ADMIN", "AGENCE", "BANK"],
                "refBy": "5"
            }]
        },
        updatePermission: {
            "id": 1,
            "data": {
                "annonce": false,
                "localisation": true
            }
        },
        responseUdatePermission: {
            "id": 1,
            "estimate": false,
            "annonce": true,
            "localisation": true,
            "rapport": false,
            "userId": 1
        }
    }
}


const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index')
})

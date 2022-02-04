const express = require('express');
const router = express.Router();


router.post('/user', (req, res) => {
    /* 	#swagger.tags = ['User']
        #swagger.description = 'Endpoint to sign in a specific user' */
    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information. testing',
            required: true,
            schema: { $ref: "#/definitions/login" }
    } */
    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    /* #swagger.responses[200] = { 
      schema: { "$ref": "#/definitions/responseLogin" },
      description: "User login successfully." } */
    res.json({ message: 'alive auth api-user post' });
}
);


router.get('/user', (req, res) => {
    res.json({ message: 'alive auth api-user get' });
}
);

module.exports = router;
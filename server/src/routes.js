const express = require('express')

const router = express.Router()

router.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use('/api', require('./users/user.controller'))


router.get('/', (req, res) => {
    res.json({ message: 'alive auth' });
});
router.post('/test', (req, res) => {
    //console.log(req.body)
    res.json({ message: 'alive auth' });
});

module.exports = router
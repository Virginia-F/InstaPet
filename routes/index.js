var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController')


router.get('/', indexController.allOwner );



module.exports = router;

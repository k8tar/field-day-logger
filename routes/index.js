var express = require('express');
var router = express.Router();
const db = require('../lib/db');
const log = require('../lib/log');
const fs = require('fs');
const radio = require('../lib/radio');

router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Express' });
});



module.exports = router;

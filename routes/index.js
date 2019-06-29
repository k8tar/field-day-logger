var express = require('express');
var router = express.Router();
const nano = require('nano');
const log = require('../lib/log');
const fs = require('fs');
const radio = require('../lib/radio');

router.get('/', async function(req, res, next) {

  var db_bands = nano.use('bands');
  db_bands = await db_bands.list(); 
  bands = db_bands.rows;
  

  var db_modes = nano.use('modes');
  db_modes = await db_modes.list(); 
  modes = db_modes.rows;
  modes = modes.data.rows;

  if(bands.length > 0 && modes.length > 0 ) { 
    res.redirect('/contacts')
  } else {
    const cp  = require('child_process');
    const os = require('os')

    response.send('<strong>Setup was not run... running setup</strong>')
    let stdout = cp.execSync('node ../setup.js');
    response.send(stdout.toString().trim());

    response.send('<a href="/">Reload</a>')
  }
  //res.render('index', { title: 'Express' });
});



module.exports = router;

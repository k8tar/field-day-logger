var express = require('express');
var router = express.Router();
const db = require('../lib/db');
const log = require('../lib/log');
const fs = require('fs');
const radio = require('../lib/radio');
var moment = require('moment');


router.get('/', async function(req, res, next) {

  try { 

    var operation = {};
    if(fs.existsSync('operation.json')) { 
        operation =  await JSON.parse(fs.readFileSync('operation.json'));
    }    

    var config = {};
    if(fs.existsSync('config.json')) { 
        config =  JSON.parse(fs.readFileSync('config.json'));
    }


    let bands = await db.get('bands', '/_all_docs');
    bands = bands.data.rows;
    
    
    let modes = await db.get('modes', '/_all_docs');
    
    modes = modes.data.rows;
    
    let contacts_data = await db.get('contacts', '/_all_docs', {include_docs:true});
    var contacts = [];
    
    if(contacts_data.data) { 
      contacts_data.data.rows.forEach(function(contact) {
        console.log(contact.doc);
        contacts.push(contact.doc);
      
      });
      //contacts = data.rows;
    }


    bands.forEach(function(band){
      if(band.id == operation.band) {
        band.selected = 'selected';
      }
    });

    modes.forEach(function(mode){
      if(mode.id == operation.mode) {
        mode.selected = 'selected';
      }
    });


    var page_values = {
      operator_callsign: operation.operator_callsign,
      bands: bands,
      band: operation.band,
      modes: modes,
      mode: operation.mode,
      station_name: config.station_name,
      contacts: contacts

    };


    res.render('contacts', page_values);

  } catch($err) { 
    log.write($err);
  }
});


router.post('/', async function(req, res, next) {
  console.log(req.body);
  if(req.body.operation == 'add_contact') { 
      
      if(req.body.callsign.trim() != '' && req.body.section.trim() != '' && req.body.class.trim() != '') { 
        var contact = {
            callsign: req.body.callsign.toString().trim(),
            section: req.body.section.toString().trim(),
            class: req.body.class.toString().trim(),
            band: req.body.band.toString().trim(),
            mode: req.body.mode.toString().trim(),
            operator: req.body.operator_callsign.toString().trim(),
            station_name: req.body.station_name.toString().trim(),
            timestamp: moment().format('YYYY-MM-DD hh:mm:ss')
          }
        let {data, headers, status} = await db.insert('contacts', contact);
        log.write('added ' + req.body.callsign + ' ' + req.body.section + ' ' + req.body.class, 'success');
        res.redirect('/contacts?msg=' + req.body.callsign + ' logged');
      }

     
    
  } else if(req.body.operation == 'update') { 
    delete req.body.operation;
    fs.writeFileSync('operation.json', JSON.stringify(req.body));
    log.write('updated operation settings');
    console.log(JSON.stringify(req.body));
    res.redirect('/contacts?msg=updated operation settings');
  }
  
});

router.get('/download', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

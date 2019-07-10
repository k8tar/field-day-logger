var express = require('express');
var router = express.Router();
const fs = require('fs');
const nano = require('nano')('http://localhost:5984'); 

const log = require('../lib/log');
const radio = require('../lib/radio');
var moment = require('moment');


router.get('/', async function(req, res, next) {
  
  // try { 

    
    var operation = {};
    if(fs.existsSync('operation.json')) { 
        operation =  await JSON.parse(fs.readFileSync('operation.json'));
    }    

    var config = {};
    if(fs.existsSync('config.json')) { 
        config =  JSON.parse(fs.readFileSync('config.json'));
    }

    let db_bands = nano.use('bands');
    let db_modes = nano.use('modes');
    let db_sections = nano.use('sections');

    var bands = [];
    db_bands = await db_bands.list({include_docs: true}) 
    await db_bands.rows.forEach(db_band => {
      
      var band = {};
      band.name = db_band.doc.name.trim();
      if(band.name.trim() == operation.band.trim()) {
        band.selected = 'selected';
      }
      bands.push(band);
      //console.log(band);
      
    });
    
    var modes = [];
    db_modes = await db_modes.list({include_docs: true}); 

    db_modes = db_modes.rows.forEach(function(mode) {
      modes.push({name: mode.doc.name});
    })

    var sections = [];
    

    db_sections = await db_sections.list({include_docs: true}) 
    await db_sections.rows.forEach(async function(section){
      if(!sections[section.doc.area]) { 
        sections[section.doc.area] = {name:section.doc.area, values:[]};
        
      }
      sections[section.doc.area].values.push({name:section.doc.name});
  
    });
    
 


    modes.forEach(function(mode){
      if(mode.name == operation.mode) {
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
      radio: (config.radio ? config.radio : ''),
      sections: sections,
    };

    res.render('contacts', page_values);

  // } catch($err) { 
  //   log.write($err);
  // }
});


router.post('/', async function(req, res, next) {
      
      if(req.body.callsign.trim() != '' && req.body.section.trim() != '' && req.body.class.trim() != '') { 
        //console.log(req.body);
        var contact = {
            timestamp: moment().format('YYYY-MM-DD hh:mm:ss'),
            callsign: req.body.callsign.toString().trim(),
            section: req.body.section.toString().trim(),
            class: req.body.class.toString().trim(),
            band: req.body.band.toString().trim(),
            mode: req.body.mode.toString().trim(),
            operator_callsign: req.body.operator_callsign.toString().trim(),
            station_name: req.body.station_name.toString().trim()
          }
        var contacts = nano.use('contacts');
        contacts.insert( contact );
        log.write('added ' + req.body.callsign + ' ' + req.body.section + ' ' + req.body.class, 'success');
        fs.writeFileSync('operation.json', JSON.stringify(req.body));
        log.write('updated operation settings', 'success');
      
      }

      await res.sendStatus(200);
      
});

router.post('/find', async function(req, res, next) {
    //  var query = req.query;
      var query = {
        callsign: {'$eq':req.body.callsign},
        band: {'$eq' : req.body.band},
        mode: {'$eq' : req.body.mode}
      
      } 
  
      var db_contacts = nano.use('contacts');
      var result = await db_contacts.find({
        selector: query
      });
      res.send(result.docs);
  
});

router.get('/download', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/json', async function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  var db_contacts = nano.use('contacts');
  db_contacts = await db_contacts.list({include_docs: true, descending: true});
  
  
  var contacts = [];
  //console.log(db_contacts.rows);
  if(db_contacts.rows) { 
    db_contacts.rows.forEach(function(contact) {
      contact.doc.timestamp = moment(contact.doc.timestamp).format('M/D h:mm A');
      contacts.push(contact.doc);
    });
  }
  
  res.send(JSON.stringify(contacts));
  
  
});
  
  


module.exports = router;

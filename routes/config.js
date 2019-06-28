var express = require('express');
var router = express.Router();
const db = require('../lib/db');
const log = require('../lib/log');
const fs = require('fs');
const radio = require('../lib/radio');

var sections = [];
var radios = [];
router.get('/', async function(req, res, next) { 



  try {

    var config = {};
    if(fs.existsSync('config.json')) { 
        config =  JSON.parse(fs.readFileSync('config.json'));
    }


    let {data, headers, status} = await db.get('sections', '/_all_docs');
    sections = (data.rows) ? data.rows : [];
    
    sections.forEach(function(section){
      if(section.id == config.section) { 
        section.selected = 'selected';
      }
    });

    radios = await radio.list_radios(config.radio);



   

    var page_values = {
      title: 'Configure Station',
      station_name: (config.station_name ? config.station_name : 'CW Tent 1'),
      club_call: (config.club_call ? config.club_call : 'K8TAR'),
      class: (config.class ? config.class : '2A'),
      section: (config.section ? config.section : 'MI'),
      sections: sections,
      radio: (config.radio ? config.radio : 1),
      radios: radios,
      civaddress: (config.civaddress ? config.civaddress : '82h'),
      port_speed: (config.port_speed ? config.port_speed : 19200),
      port: (config.port ? config.port : '/dev/ttyUSB0')
    };
    
     res.render('config', page_values);


  } catch (err) {
    log.write(err, 'error');
  }

});


router.post('/', function(req, res){
    var config = JSON.stringify(req.body);
    console.log(config);
    fs.writeFileSync('config.json', config);
  
    log.write('Stored config to config.json', 'success');
    res.redirect('/config?msg=config.json written');
});

router.get('/radio', async function(req, res, next) { 
    var config = {};
    if(fs.existsSync('config.json')) { 
        config =  JSON.parse(fs.readFileSync('config.json'));
    }
    
    var frequency = radio.cmd('get_freq', config.radio, config.port, config.port_speed) / 1000000
    
    switch(radio.cmd('get_mode', config.radio, config.port, config.port_speed).split('\r\n')[0]) {
        case 'FM' :
        case 'AM' :
        case 'USB' :
                if(frequency.toString().indexOf('.070') >0 ) {
                    mode='DIG';
                    break;
                } 
        case 'LSB' :
        case 'WFM' :
            mode='PHN';
            break;
        case 'CW':
        case 'CWR':
            mode ='CW';
            break;
        case 'RTTY':
        case 'RTTYR':
            mode='DIG';
            break;
        
    }

    var settings = {
        frequency:frequency,
        mode: mode
    }
    console.log(settings);
    res.send(settings);
});

module.exports = router;
var express = require('express');
var router = express.Router();
const nano = require('nano')('http://localhost:5984'); 
const fs = require('fs');

const log = require('../lib/log');
const radio = require('../lib/radio');

var sections = [];
var radios = [];
router.get('/', async function(req, res, next) { 

  try {

    var config = {};
    if(fs.existsSync('config.json')) { 
        config =  JSON.parse(fs.readFileSync('config.json'));
    }

    var db_sections = await nano.use('sections').db;
    db_sections = await db_sections.list(); 
    
    sections = db_sections.rows;  
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
    
    fs.writeFileSync('config.json', config);
  
    log.write('Stored config to config.json', 'success');
    res.redirect('/config?msg=config.json written');
});

router.get('/radio', async function(req, res, next) { 
    var config = {};
    if(fs.existsSync('config.json')) { 
        config =  JSON.parse(fs.readFileSync('config.json'));
    }
    
    var frequency = radio.cmd('get_freq', config.radio, config.port, config.port_speed) / 1000
    var mode = radio.cmd('get_mode', config.radio, config.port, config.port_speed).split('\r\n')[0]

    var band;
    switch (true) { 
        case (frequency >= 1800 && frequency <= 2000) : 
          band = '160M';
          break;
        case (frequency >=3500 && frequency <= 4000) : 
          band = '80M';
          break;
        case (frequency >=5000 && frequency <= 6000) : 
          band = '60M';
          break;
        case (frequency >=7000 && frequency <= 7300) : 
          band = '40M';
          break;
        case (frequency >=10100 && frequency <= 10150) : 
          band = '30M';
          break;
        case (frequency >=14000 && frequency <= 14350) : 
          band = '20M';
          break;
        case (frequency >=18068 && frequency <= 18168) : 
          band = '17M';
          break;
        case (frequency >=21000 && frequency <= 21450) : 
          band = '15M';
          break;
        case (frequency >=24890 && frequency <= 24990) : 
          band = '12M';
          break;
        case (frequency >=28000 && frequency <= 29700) : 
          band = '10M';
          break;
        case (frequency >=50000 && frequency <= 54000) : 
          band = '6M';
          break;
        case (frequency >=144000 && frequency <= 148000) : 
          band = '2M';
          break;
        case (frequency >=222000 && frequency <= 225000) : 
          band = '1.25M';
          break;
        case (frequency >=420000 && frequency <= 450000) : 
          band = '70CM';
          break;
        case (frequency >=902000 && frequency <= 928000) : 
          band = '33CM';
          break;
        case (frequency >=1240000 && frequency <= 1300000) : 
          band = '23CM';
          break;
        case ((frequency >=2300000 && frequency <= 2310000) || (frequency >=2390000 && frequency <= 2450000))  : 
          band = '13CM';
          break;
    }

    switch(mode) {
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
        mode: mode,
        band: band
    }

    //console.log(JSON.stringify(settings));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(settings));
});

module.exports = router;
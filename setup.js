const log = require('./lib/log'); 
const nano = require('nano')('http://localhost:5984'); 
const fs = require('fs'); 

async function setup_tables() {
    var support_tables = [
        {
            name : 'bands',
            values: [
                { name:'440'},
                { name:'220'},
                { name:'2M' },
                { name: '6M' },
                { name: '10M' },
                { name: '15M' },
                { name: '20M' },
                { name: '40M' },
                { name: '80M' },
                { name: '160M'}
            ]
        },
        {
            name: 'modes',
            values: [
                { name:'CW' },
                { name:'PHN' },
                { name:'DIG' }
            ]
        },
        {   
            name: 'sections',
            values: [
                { name:'CT', area: '1'},
                { name:'EMA', area: '1' },
                { name:'ME', area: '1' },
                { name:'NH', area: '1' },
                { name:'RI', area: '1' },
                { name:'VT', area: '1' },
                { name:'WMA', area: '1' },
                { name:'ENY', area: '2' },
                { name:'NLI', area: '2' },
                { name:'NNJ', area: '2' },
                { name:'NNY', area: '2' },
                { name:'SNJ', area: '2' },
                { name:'WNY', area: '2' },
                { name:'DE', area: '3' },
                { name:'EPA', area: '3' },
                { name:'MDC', area: '3' },
                { name:'WPA', area: '3' },
                { name:'AL', area: '4' },
                { name:'GA', area: '4' },
                { name:'KY', area: '4' },
                { name:'NC', area: '4' },
                { name:'NFL', area: '4' },
                { name:'SC', area: '4' },
                { name:'SFL', area: '4' },
                { name:'WCF', area: '4' },
                { name:'TN', area: '4' },
                { name:'VA', area: '4' },
                { name:'PR', area: '4' },
                { name:'VI', area: '4' },
                { name:'AR', area: '5' },
                { name:'LA', area: '5' },
                { name:'MS', area: '5' },
                { name:'NM', area: '5' },
                { name:'NTX', area: '5' },
                { name:'OK', area: '5' },
                { name:'STX', area: '5' },
                { name:'WTX', area: '5' },
                { name:'EB', area: '6' },
                { name:'LAX', area: '6' },
                { name:'ORG', area: '6' },
                { name:'SB', area: '6' },
                { name:'SCV', area: '6' },
                { name:'SDG', area: '6' },
                { name:'SF', area: '6' },
                { name:'SJV', area: '6' },
                { name:'SV', area: '6' },
                { name:'PAC', area: '6' },
                { name:'AZ', area: '7' },
                { name:'EWA', area: '7' },
                { name:'ID', area: '7' },
                { name:'MT', area: '7' },
                { name:'NV', area: '7' },
                { name:'OR', area: '7' },
                { name:'UT', area: '7' },
                { name:'WWA', area: '7' },
                { name:'WY', area: '7' },
                { name:'AK', area: '7' },
                { name:'MI', area: '8' },
                { name:'OH', area: '8' },
                { name:'WV', area: '8' },
                { name:'IL', area: '9' },
                { name:'IN', area: '9' },
                { name:'WI', area: '9' },
                { name:'CO', area: '0' },
                { name:'IA', area: '0' },
                { name:'KS', area: '0' },
                { name:'MN', area: '0' },
                { name:'MO', area: '0' },
                { name:'NE', area: '0' },
                { name:'ND', area: '0' },
                { name:'SD', area: '0' },
                { name:'MAR', area: 'CA' },
                { name:'NL', area: 'CA' },
                { name:'QC', area: 'CA' },
                { name:'ONE', area: 'CA' },
                { name:'ONN', area: 'CA' },
                { name:'ONS', area: 'CA' },
                { name:'GTA', area: 'CA' },
                { name:'MB', area: 'CA' },
                { name:'SK', area: 'CA' },
                { name:'AB', area: 'CA' },
                { name:'BC', area: 'CA' },
                { name:'NT', area: 'CA' },
                { name:'DX', area: 'DX' }
            ]
        },
        {
            name:'contacts',
            //notruncate: true,
            novalues: true
        }
    ];

    


    await support_tables.forEach(async function(table){
        var db = nano.use(table.name);
        if(!table.notruncate) { 
            log.write('dropping ' + table.name, 'info')
            
            
            await nano.db.destroy(table.name).then( () => {
                log.write('dropped ' + table.name,  'success')
            }, async err => {
                log.write('dropping ' + table.name + ' : ' + err, 'error')
            });
        }

     
        await nano.db.create(table.name).then(async () => { 
            await log.write('adding ' + table.name, 'info');
            var db = nano.use(table.name);
            if(!table.novalues) { 
                await table.values.forEach(async function(value){
                    console.log(value);
                    await db.insert(value).then(async ({data, headers, status}) => { 
                        await log.write('added ' + table.name + ' : ' + value.name, 'success');
                    }, err => {
                        log.write('added ' + table.name + ' : ' + value.name + ' : ' + err, 'error');
                    });
                });
            }
        },  err => {
            log.write('adding  : ' + table.name + ' : ' +  err, 'error');
       
        });
    
    });

}

setup_tables();
const log = require('./lib/log'); 
const db = require('./lib/db'); 
//const radio = require('./lib/radio'); 
const fs = require('fs'); 
//TODO: rewrite all console.log functions to standardize console, file, or database logging.

async function setup_tables() {
    var support_tables = [
        {
            name : 'bands',
            values: [
                { _id:'70cm'},
                { _id:'1.25m'},
                { _id:'2m' },
                { _id:'6m' },
                { _id:'10m' },
                { _id:'15m' },
                { _id:'20m' },
                { _id:'40m' },
                { _id:'80m' },
                { _id:'160m '}
            ]
        },
        {
            name: 'modes',
            values: [
                { _id:'CW' },
                { _id:'PHN' },
                { _id:'DIG' }
            ]
        },
        {   
            name: 'sections',
            values: [
                { _id:'CT', area: '1'},
                { _id:'EMA', area: '1' },
                { _id:'ME', area: '1' },
                { _id:'NH', area: '1' },
                { _id:'RI', area: '1' },
                { _id:'VT', area: '1' },
                { _id:'WMA', area: '1' },
                { _id:'ENY', area: '2' },
                { _id:'NLI', area: '2' },
                { _id:'NNJ', area: '2' },
                { _id:'NNY', area: '2' },
                { _id:'SNJ', area: '2' },
                { _id:'WNY', area: '2' },
                { _id:'DE', area: '3' },
                { _id:'EPA', area: '3' },
                { _id:'MDC', area: '3' },
                { _id:'WPA', area: '3' },
                { _id:'AL', area: '4' },
                { _id:'GA', area: '4' },
                { _id:'KY', area: '4' },
                { _id:'NC', area: '4' },
                { _id:'NFL', area: '4' },
                { _id:'SC', area: '4' },
                { _id:'SFL', area: '4' },
                { _id:'WCF', area: '4' },
                { _id:'TN', area: '4' },
                { _id:'VA', area: '4' },
                { _id:'PR', area: '4' },
                { _id:'VI', area: '4' },
                { _id:'AR', area: '5' },
                { _id:'LA', area: '5' },
                { _id:'MS', area: '5' },
                { _id:'NM', area: '5' },
                { _id:'NTX', area: '5' },
                { _id:'OK', area: '5' },
                { _id:'STX', area: '5' },
                { _id:'WTX', area: '5' },
                { _id:'EB', area: '6' },
                { _id:'LAX', area: '6' },
                { _id:'ORG', area: '6' },
                { _id:'SB', area: '6' },
                { _id:'SCV', area: '6' },
                { _id:'SDG', area: '6' },
                { _id:'SF', area: '6' },
                { _id:'SJV', area: '6' },
                { _id:'SV', area: '6' },
                { _id:'PAC', area: '6' },
                { _id:'AZ', area: '7' },
                { _id:'EWA', area: '7' },
                { _id:'ID', area: '7' },
                { _id:'MT', area: '7' },
                { _id:'NV', area: '7' },
                { _id:'OR', area: '7' },
                { _id:'UT', area: '7' },
                { _id:'WWA', area: '7' },
                { _id:'WY', area: '7' },
                { _id:'AK', area: '7' },
                { _id:'MI', area: '8' },
                { _id:'OH', area: '8' },
                { _id:'WV', area: '8' },
                { _id:'IL', area: '9' },
                { _id:'IN', area: '9' },
                { _id:'WI', area: '9' },
                { _id:'CO', area: '0' },
                { _id:'IA', area: '0' },
                { _id:'KS', area: '0' },
                { _id:'MN', area: '0' },
                { _id:'MO', area: '0' },
                { _id:'NE', area: '0' },
                { _id:'ND', area: '0' },
                { _id:'SD', area: '0' },
                { _id:'MAR', area: 'CA' },
                { _id:'NL', area: 'CA' },
                { _id:'QC', area: 'CA' },
                { _id:'ONE', area: 'CA' },
                { _id:'ONN', area: 'CA' },
                { _id:'ONS', area: 'CA' },
                { _id:'GTA', area: 'CA' },
                { _id:'MB', area: 'CA' },
                { _id:'SK', area: 'CA' },
                { _id:'AB', area: 'CA' },
                { _id:'BC', area: 'CA' },
                { _id:'NT', area: 'CA' },
                { _id:'DX', area: 'DX' }
            ]
        },
        {
            name:'contacts',
            //notruncate: true,
            novalues: true
        }
    ];

    


    await support_tables.forEach(async function(table){
        if(!table.notruncate) { 
            log.write('dropping ' + table.name, 'info')
            await db.dropDatabase(table.name).then( () => {
                log.write('dropped ' + table.name,  'success')
            }, async err => {
                log.write('dropping ' + table.name + ' : ' + err, 'error')
            });
        }

     
        await db.createDatabase(table.name).then(async () => { 
            await log.write('adding ' + table.name, 'info');
            if(!table.novalues) { 
                await table.values.forEach(async function(value){
                    await db.insert(table.name, value).then(async ({data, headers, status}) => { 
                        await log.write('added ' + table.name + ' : ' + value._id, 'success');
                    }, err => {
                        log.write('added ' + table.name + ' : ' + value._id + ' : ' + err, 'error');
                    });
                });
            }
        },  err => {
            log.write('adding  : ' + table.name + ' : ' +  err, 'error');
       
        });
    
    });

}

/*
function setup_radios() {
        // Setup Radio options for hamlib/rigctl

        //var radios = radio.list_radios();
        console.log(radios);
        //fs.writeSync('../radios.json', JSON.stringify(radios));
    
}
*/

    setup_tables();
    //setup_radios();

function list_radios (selected_value) { 
    const cp  = require('child_process');
    const os = require('os')

    var radios = [];
    let stdout = cp.execSync('rigctl --list'); 
    stdout.toString().trim().split(os.EOL).forEach(function(row, index){
        if(index != 0) {
            var id = row.substr(3, 4).trim();
            var brand = row.substring(8, 23).trim();
            var model = row.substring(31, 50).trim();
            var selected = (id == selected_value) ? true : false;

            radios.push({
                id: id,
                model: brand + ' ' + model,
                selected: selected
            });
        }
        
    });
    
    return radios;

}

function cmd(cmd, radio_model_id, port, port_speed) { 
    const cp  = require('child_process');
    const os = require('os')

    let stdout = cp.execSync('rigctl -m ' +radio_model_id + '-r ' + port + '-s ' +port_speed + ' ' + cmd);
    return stdout.toString().trim()
}

// TODO: Write list_comports using set serial on Linux and 
   

module.exports = { list_radios, cmd }
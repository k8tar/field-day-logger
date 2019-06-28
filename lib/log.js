exports.write = function (msg, level) {
    var date = new Date();
    var prefix;
    switch(level) { 
        case 'error': 
            prefix='[!]';
            break;
        case 'success':
            prefix='[o]';
            break;
        case 'info':
            prefix='[-]';
            break
    }
    
    console.log(prefix + ' ' + date.toDateString() + ' : ' + msg );
  };
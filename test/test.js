var Dictionary = require('../lib/client').Dictionary;

var d = new Dictionary({name: 'raddb', file: 'dictionary'});
d.read(function() {
    console.log(d.getAllAttributes());    
});

var radius = require('../lib/client'),
    Dictionary = radius.Dictionary,
    Packet = radius.Packet,
    Client = radius.Cient;

var d = new Dictionary({name: 'raddb', file: 'dictionary'});
d.read(function() {
    console.log(d.getAllAttributes());    
});

var radius = require('../lib/client');

var Dictionary = radius.Dictionary,
    Packet = radius.Packet,
    Client = radius.Cient;

var d = new Dictionary({name: 'raddb', file: 'dictionary'});
d.read(function() {
    console.log('Successfully read dictionary. Contents:');
    console.log(d.getAllAttributes());
    
    console.log('Instantiating new packet and adding attributes');
    var p = new Packet(d, "foobarbaz");
    p.addAttribute('hsa-uid', 40102);
    p.addAttribute('foobar', 'baz');
    
    console.log('Added attributes, getting encoded attributes');
    console.log(p.getEncodedAttributes().toString('base64'));
});



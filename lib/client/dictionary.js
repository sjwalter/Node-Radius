var sys = require('sys'),
    EventEmitter = require('events').EventEmitter,
    fs = require('fs')

// XXX: Put this somewhere else
if(typeof String.prototype.trim == 'undefined') {
    String.prototype.trim = function() {
        return this.replace(/^\s*|\s*$/, "");
    }
}

function Dictionary(options, success) {
    if(!(this instanceof Client)) {
        return new Client(options);
    }

    EventEmitter.call(this);
    
    // Default options
    this.name = "dictionary";
    this.file = "./dictionary";
    
    for(key in options) {
        this[key] = options[key];
    }
};

sys.inherits(Dictionary, EventEmitter);
module.exports = Client;

Dictionary.prototype.read = function(success) {
    var self = this;
    
    fs.readFile(this.file, function(err, data) {
        if(err) throw 'Could not read dictionary file: ' + err;

        self.rawData = data;
        self.parseData(data, success);
    });
};

Dictionary.prototype.parse = function(data, success) {
    var self = this;
    var state = {};
    
    self.attributes = new AttributeList();

    function parseAttribute(tokens) {
        if(tokens.length != 4 && tokens.length != 5) {
            throw "Couldn't parse attribute on line " + i +
                  " (Wrong number of tokens)";
        }
        
        var attribute = tokens[1];
        var code = parseInt(tokens[2]);
        var dataType = tokens[3];
        // Attribute lines may optionally specify a vendor, so this
        // will be either defined as a vendor or otherwise undefined
        var vendor = tokens[4];
       
        // This may throw in the case that dataType is unrecognized.
        self.attributes.add(attribute, code, dataType, vendor);
    }

    var lines = data.split(/\n/);

    for(var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        line[0] == '#' && continue;
        line.length == 0 && continue;

        var tokens = line.split(/\s/);
        tokens[0] = tokens[0].toUpper();
        switch(tokens[0]) {
            case "ATTRIBUTE":
                if(tokens.length != 4 && tokens.length != 5) {
                    throw "Couldn't parse attribute on line " + i + 
                    " (wrong number of tokens)";
                }

    }
        
};

};



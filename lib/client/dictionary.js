var sys = require('sys'),
    EventEmitter = require('events').EventEmitter,
    fs = require('fs')

// XXX: Put this somewhere else
if(typeof String.prototype.trim == 'undefined') {
    String.prototype.trim = function() {
        return this.replace(/^\s*|\s*$/, '');
    }
}

function Dictionary(options) {
    if(!(this instanceof Dictionary)) {
        return new Client(options);
    }

    // Default options
    this.name = 'dictionary';
    this.file = './dictionary';
    
    for(key in options) {
        this[key] = options[key];
    }
};

module.exports = Dictionary;

function AttributeList() {
    if(!(this instanceof AttributeList)) {
        return new AttributeList();
    }
    
    var self = this;
    self.attributes = {};
    
    function isValidDataType(dataType) {
        return ((dataType == 'string') ||
                (dataType == 'ipaddr') ||
                (dataType == 'integer') ||
                (dataType == 'date') ||
                (dataType == 'octets') ||
                (dataType == 'abinary') ||
                (dataType == 'ipv6addr') ||
                (dataType == 'ifid'));
    }

    // Add an attribute
    self.add = function(attribute, code, dataType, vendor) {
        if(!isValidDataType(dataType)) {
            throw 'Dictionary parse error: Bad data type: ' + dataType;
        }

        self.attributes[attribute] = {
            code: code,
            dataType: dataType,
            vendor: vendor
        };
    };
    
    self.getAttribute = function(attribute) {
        if(self.attributes.hasOwnProperty(attribute)) {
            return self.attributes[attribute];
        } else {
            throw 'Dictionary does not contain attribute "' + attribute + '"';
        }
    };
    
    self.getAllAttributes = function() {
        return self.attributes;
    };
};

Dictionary.prototype.read = function(onSuccess) {
    var self = this;
    
    fs.readFile(this.file, function(err, data) {
        if(err) throw 'Could not read dictionary file: ' + err;
        self.rawData = data;
        self.parse(data, onSuccess);
    });
};

Dictionary.prototype.parse = function(data, onSuccess) {
    var self = this;
    var state = {};
    
    self.attributes = new AttributeList();

    function parseAttribute(tokens) {
        if(tokens.length != 4 && tokens.length != 5) {
            throw 'Could not parse attribute on line ' + lineNo +
                  ' (Wrong number of tokens)';
        }
        
        var attribute = tokens[1];
        var code = parseInt(tokens[2]);
        var dataType = tokens[3].toLowerCase();
        // Attribute lines may optionally specify a vendor, so this
        // will be either defined as a vendor or otherwise undefined
        var vendor = tokens[4];
       
        // This may throw in the case that dataType is unrecognized.
        self.attributes.add(attribute, code, dataType, vendor);
    }

    var lines = String(data).split(/\n/);

    for(var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        var lineNo = i + 1;
        if(line[0] == '#' || line.length == 0) {
            continue;
        }

        var tokens = line.split(/\s+/);
        tokens[0] = tokens[0].toUpperCase();
        switch(tokens[0]) {
            case 'ATTRIBUTE':
                parseAttribute(tokens);
                break;
        }
    }

    typeof onSuccess == 'function' && onSuccess();
};

Dictionary.prototype.getAttribute = function(attribute) {
    var self = this;
    return self.attributes.getAttribute(attribute);
};

Dictionary.prototype.getAllAttributes = function() {
    var self = this;
    return self.attributes.getAllAttributes();
};

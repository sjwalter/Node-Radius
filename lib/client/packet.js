var Buffer = require('buffer').Buffer;

var PacketCodes = {
    AccessRequest: 1,
    AccessAccept: 2,
    AccessReject: 3,
    AccountingRequest: 4,
    AccountingResponse: 5,
    AccessChallenge: 11,
    StatusServer: 12,
    StatusClient: 13,
    DisconnectRequest: 40,
    DisconnectACK: 41,
    DisconnectNAK: 42,
    CoARequest: 43,
    CoAACK: 44,
    CoANAK: 45
};

// XXX: Move this somewhere else
if(typeof Math.randRange == 'undefined') {
    // Return a number between min and max (inclusive of min and max)
    Math.randRange = function(min, max) {
        if(min > max) {
            var temp = min;
            min = max;
            max = temp;
        }

        // Trivial case: range includes only one possibility
        if(min == max) {
            return min;
        }

        var diff = max - min;
        return (Math.floor(Math.random() * (diff + 1)) + min);
    };
}

var PacketUtils = {
    // Generate a RADIUS packet identifier. This is a 16 byte
    // authenticator that is used in the password hiding algorithm
    // and as well to authenticate replies from the server.
    generateAuthenticator: function() {
        var authenticator = new Buffer(16);
        for(var i = 0; i < length; i++) {
            authenticator[i] = Math.randRange(0, 255);
        }
        return authenticator;
    },
    
    // Generate a RADIUS packet ID. This is simply a random byte.
    generateID: function() {
        return Math.randRange(0, 255);
    },

    // Encode a set of packet attributes for sending over the wire.
    encodeAttributes: function(attrs) {
        var encodedAttributes = [];
        var totalLength = 0;
        
        for(var key in attrs) {
            encodedAttributes.push(
                PacketUtils.encodeAttribute(key, attrs[key])
            );

            // XXX: Fix this for key types of tuple
            // Right now, this is the trivial case where the length
            // of one attribute pair is 2 bytes (key + length) more
            // than the length of the value itself.
            totalLength += 2 + attrs[key].length;
        }

        var result = new Buffer(totalLength);
        var resultIndex = 0;
        for(var i = 0; i < encodedAttributes.length; i++) {
            var currentAttribute = encodedAttributes[i];
            for(var j = 0; j < currentAttribute.length; j++) {
                result[resultIndex] = currentAttribute[j];
                resultIndex++;
            }
        }
        return result;
    },

    // Encode a single attribute for sending over the wire.
    // key may be either a string, an attribute code, or an 
    // object: 
    // {vendor: 'vendor_code', attribute: 'attribute_code'}
    // Note: incoming value must be a buffer
    encodeAttribute: function(key, value) {
        if(key instanceof Array) {
            
        }
        
        // key is 1 byte, length is 1 byte. The length is the entire
        // encoded attribute length, hence it's value.length + 2 for
        // the initial key and length bytes
        var result = new Buffer(2 + value.length);
        
        // Explicitly write the key and length values
        result[0] = key;
        result[1] = 2 + value.length;
        for(var i = 0; i < value.length; i++) {
            result[2 + i] = value[i];
        }
        return result;
    }
};

function Packet(dictionary, secret, type, options) {
    if(!(this instanceof Packet)) {
        return new Packet(options);
    }

    if(!(dictionary && dictionary instanceof Dictionary)) {
        throw 'Packet must be passed a dictionary as its first parameter.';
    }

    if(!secret) {
        throw 'Packet must be passed the server\'s secret.';
    }

    this.dictionary = dictionary;
    this.secret = secret;
    this.type = type || 'auth';
    this.code = 0;
    this.id = 0;
    this.rawPacket = '';
    this.data = {};

    for(var key in options) {
        this[key] = options[key];
    }

    if(!this.hasOwnProperty('authenticator')) {
        this.authenticator = PacketUtils.generateAuthenticator();
    }

    if(!this.hasOwnProperty('id')) {
        this.id = PacketUtils.generateID();
    }
}

module.exports = Packet;

Packet.prototype.addAttribute = function(key, value) {
    if(data[key]) {
        data[key].push(value);
    } else {
        data[key] = [value];
    }
};

Packet.prototype.getEcondedAttributes = function() {
    return PacketUtils.encodeAttributes(self.data);    
};

Packet.prototype.getRawPacket = function() {
    var self = this;
    
    var attributes = self.getEncodedAttributes();

};

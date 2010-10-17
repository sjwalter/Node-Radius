
var PacketCodes = {
    AccessRequest: 1
    AccessAccept: 2
    AccessReject: 3
    AccountingRequest: 4
    AccountingResponse: 5
    AccessChallenge: 11
    StatusServer: 12
    StatusClient: 13
    DisconnectRequest: 40
    DisconnectACK: 41
    DisconnectNAK: 42
    CoARequest: 43
    CoAACK: 44
    CoANAK: 45
};

// XXX: Move this somewhere else
if(typeof Math.prototype.randRange == 'undefined') {
    // Return a number between min and max (inclusive of min and max)
    Math.prototype.randRange = function(min, max) {
        if(min > max) {
            var temp = min;
            min = max;
            max = temp;
        }

        // Trivial case: there range includes only one possibility
        if(min == max) {
            return min;
        }

        var diff = max - min;
        return (Math.floor(Math.random() * (diff + 1)) + min);
    };
}

var PacketUtils = {
    generateAuthenticator: function(length) {
        length = length || 16;
        var authenticator = new Buffer(length);
        for(var i = 0; i < length; i++) {
            authenticator[i] = Math.randRange(0, 255);
        }
        return authenticator;
    }
};

function Packet(options) {
    
}

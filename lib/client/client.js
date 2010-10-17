var sys = require('sys'),
    EventEmitter = require('events').EventEmitter;

function Client(options) {
    if(!(this instanceof Client)) {
        return new Client(options);
    }

    EventEmitter.call(this);
    
    // Default options
    this.server = 'localhost';
    this.authPort = 1812;
    this.acctPort = 1813;
    this.secret = 's3cretive';
    this.timeout = 3000;
    this.retries = 3;

    for(key in options) {
        this[key] = options[key];
    }
};

sys.inherits(Client, EventEmitter);
module.exports = Client;

Client.prototype.sendAuthPacket = function(success) {
    var self = this;
    


};



const { Duplex } = require('stream');

class EchoDuplex extends Duplex {
    constructor(options) {
        super(options);
        this.data = [];
    }
    _write(chunk, encoding, callback) {
        this.data.push(chunk);
        callback();
    }
    _read(size) {
        while (this.data.length > 0) {
            this.push(`Echo: ${this.data.shift()}`);
        }
        this.push(null);
    }
}

module.exports = EchoDuplex;
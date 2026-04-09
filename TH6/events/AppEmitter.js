const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class AppEmitter extends EventEmitter {
    logEvent(message) {
        const logMsg = `[${new Date().toLocaleString()}] Event: ${message}\n`;
        fs.appendFileSync(path.join(__dirname, '../data/log.txt'), logMsg);
        console.log(logMsg);
    }
}

const appEmitter = new AppEmitter();

// Lắng nghe sự kiện
appEmitter.on('userAction', (data) => {
    appEmitter.logEvent(`User accessed ${data.page}`);
});

appEmitter.once('init', () => {
    appEmitter.logEvent('Hệ thống khởi tạo lần đầu');
});

module.exports = appEmitter;
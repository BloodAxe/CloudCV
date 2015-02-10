var path = require('path')
  , fs = require('fs')
  , winston = require('winston')
  ;


var logsDir = process.env.LOGS || './logs'

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            name: 'info-file',
            filename: logsDir + '/cloudcv.io.info.log',
            level: 'info'
        }),
        new (winston.transports.File)({
          name: 'error-file',
          filename: logsDir + '/cloudcv.io.error.log',
          level: 'error'
        })
    ]
});

if (!fs.existsSync(logsDir)) {    
    fs.mkdirSync(logsDir);

    logger.info('Created logs directory %s', logsDir);
}


module.exports = logger;
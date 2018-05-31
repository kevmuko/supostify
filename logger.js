const winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();

const consoleOptions = {
  timestamp: tsFormat,
  colorize: true,
  level: 'debug'
};

const logger = new(winston.Logger)({
  transports: [new(winston.transports.Console)(consoleOptions)]
});

module.exports = logger;

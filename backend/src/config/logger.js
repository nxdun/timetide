const pino = require('pino');
const fs = require('fs');

// Create a writable stream for the log file
const logStream = fs.createWriteStream('./src/config/logs.log', { flags: 'a' });

// Create a Pino logger instance with options and destination
const logger = pino({
  level: 'debug',
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: `SYS:dd-mm-yyyy HH:MM:ss`,
      ignore: "pid,hostname",
    },
  }
}, logStream);

// Error handling for log file writing
logStream.on('error', (err) => {
  console.error('Error occurred while writing to log file:', err);
});

module.exports = logger;

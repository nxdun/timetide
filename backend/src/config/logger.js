const pino = require('pino');

// Create a Pino logger instance with options and destination
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: `SYS:dd-mm-yyyy HH:MM:ss`,
      ignore: "pid,hostname",
    },
  }
}, pino.destination('./src/config/logs.log', (err) => {
  if (err) {
    console.error('Error occurred while writing to log file:', err);
  }
}));

module.exports = logger;

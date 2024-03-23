const pino = require("pino");
const multistream = require("pino-multi-stream").multistream;
const fileStream = pino.destination("./System-logger.log");

//this will print only console with pretty print
const consoleTransport = pino({
  level: 'debug',
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: `SYS:dd-mm-yyyy HH:MM:ss`,
      ignore: "pid,hostname",
    },
  }
});

//this will print logs to both file and console without pretty print
//so server have very less overhead
const logger = pino(
  {
    levelFirst: true,
    translateTime: "yyyy-dd-mm, h:MM:ss TT",
    
  },
  multistream([
    { stream: fileStream },
    { stream: process.stdout, ...consoleTransport },
  ])
);

module.exports = consoleTransport;

const expressWinston = require("express-winston");
const winston = require("winston");

module.exports.errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
    }),
  ],
  format: winston.format.json(),
});

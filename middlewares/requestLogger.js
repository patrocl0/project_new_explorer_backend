const expressWinston = require("express-winston");
const winston = require("winston");

module.exports.requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: "logs/request.log",
    }),
  ],
  format: winston.format.json(),
});

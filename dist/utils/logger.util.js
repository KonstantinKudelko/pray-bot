"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, colorize, align, printf } = winston_1.format;
exports.logger = winston_1.createLogger({
    format: combine(colorize(), timestamp(), align(), printf(info => `${info.timestamp} ${info.level} ${info.message}`)),
    transports: [
        new winston_1.transports.File({
            filename: 'debug.log',
            level: 'debug',
        }),
        new winston_1.transports.Console({
            level: 'debug',
        }),
    ],
});
//# sourceMappingURL=logger.util.js.map
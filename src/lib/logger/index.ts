import { createLogger, format, transports } from 'winston';

const { combine, timestamp, colorize, align, printf } = format;

export const logger = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    align(),
    printf(info => `${info.timestamp} ${info.level} ${info.message}`),
  ),
  transports: [
    new transports.File({
      filename: 'debug.log',
      level: 'debug',
    }),
    new transports.Console({
      level: 'debug',
    }),
  ],
});

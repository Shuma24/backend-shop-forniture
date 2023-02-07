import winston from 'winston';

export const logConfiguration = {
  transports: [new winston.transports.Console({ format: winston.format.colorize({ all: true }) })],
  format: winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.label({
      label: '[LOGGER]',
    }),
    winston.format.timestamp({
      format: 'YY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      (info) => `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`,
    ),
  ),
};

import pino from 'pino';
import type { LoggerOptions as PinoLoggerOptions } from 'pino';
import { LoggerOptions } from './logger.types.js';

export function createPinoLogger(options: LoggerOptions) {
    const transport: PinoLoggerOptions['transport'] = options.pretty
        ? {
              targets: [
                  {
                      target: 'pino-pretty',
                      options: {
                          colorize: true,
                          translateTime: 'yyyy-mm-dd HH:MM:ss',
                          ignore: 'pid,hostname',
                      },
                  },
              ],
          }
        : undefined;

    return pino({
        level: options.level,
        base: {
            service: options.service,
        },
        transport,
    });
}

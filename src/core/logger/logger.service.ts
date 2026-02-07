import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import { Logger as PinoLogger } from 'pino';

@Injectable()
export class WorkerLogger implements NestLogger {
    constructor(private readonly logger: PinoLogger) {}

    log(message: any, context?: string) {
        this.logger.info({ context }, message);
    }

    error(message: any, trace?: string, context?: string) {
        this.logger.error({ trace, context }, message);
    }

    warn(message: any, context?: string) {
        this.logger.warn({ context }, message);
    }

    debug(message: any, context?: string) {
        this.logger.debug({ context }, message);
    }

    verbose(message: any, context?: string) {
        this.logger.trace({ context }, message);
    }
}

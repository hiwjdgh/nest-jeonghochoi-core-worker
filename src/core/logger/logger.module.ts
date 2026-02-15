import { Global, Module } from '@nestjs/common';
import { WorkerLogger } from './logger.service.js';
import { createPinoLogger } from './pino.factory.js';
import { CoreConfigService } from '../config/config.service.js';
import { LoggerConfig } from '../config/schemas/logger.schema.js';

interface LoggerModuleConfig {
    logger: LoggerConfig;
}

@Global()
@Module({
    providers: [
        {
            provide: 'PINO_LOGGER',
            inject: [CoreConfigService],
            useFactory: (config: CoreConfigService<LoggerModuleConfig>) => {
                const cfg = config.get().logger;
                return createPinoLogger({
                    level: cfg.level,
                    pretty: cfg.pretty,
                    service: cfg.service,
                });
            },
        },
        {
            provide: WorkerLogger,
            inject: ['PINO_LOGGER'],
            useFactory: (logger) => new WorkerLogger(logger),
        },
    ],
    exports: [WorkerLogger],
})
export class LoggerModule {}

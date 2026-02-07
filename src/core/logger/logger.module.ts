// src/logger/logger.module.ts
import { Global, Module } from '@nestjs/common';
import { WorkerLogger } from './logger.service.js';
import { createPinoLogger } from './pino.factory.js';
import { CoreConfigService } from '../config/config.service.js';

@Global()
@Module({
    providers: [
        {
            provide: 'PINO_LOGGER',
            inject: [CoreConfigService],
            useFactory: (config: CoreConfigService<any>) => {
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

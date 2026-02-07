import { Global, Module } from '@nestjs/common';
import { HttpClient } from './http.client.js';
import { CoreConfigService } from '../config/config.service.js';
import { WorkerLogger } from '../logger/logger.service.js';

@Global()
@Module({
    providers: [
        {
            provide: HttpClient,
            inject: [CoreConfigService, WorkerLogger],
            useFactory: (
                config: CoreConfigService<any>,
                logger: WorkerLogger
            ) => {
                const httpCfg = config.get().http ?? {};
                return new HttpClient(
                    {
                        timeoutMs: httpCfg.timeoutMs,
                        retries: httpCfg.retries,
                    },
                    logger
                );
            },
        },
    ],
    exports: [HttpClient],
})
export class HttpModule {}

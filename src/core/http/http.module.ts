import { Global, Module } from '@nestjs/common';
import { HttpClient } from './http.client.js';
import { WorkerLogger } from '../logger/logger.service.js';

@Global()
@Module({
    providers: [
        {
            provide: HttpClient,
            inject: [WorkerLogger],
            useFactory: (logger: WorkerLogger) => {
                return new HttpClient(logger);
            },
        },
    ],
    exports: [HttpClient],
})
export class HttpModule {}

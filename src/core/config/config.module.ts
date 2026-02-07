import { DynamicModule, Module } from '@nestjs/common';
import { CoreConfigService } from './config.service.js';
import { CoreConfigFactory } from './config.types.js';

@Module({})
export class CoreConfigModule {
    static forRoot<T>(factory: CoreConfigFactory<T>): DynamicModule {
        return {
            module: CoreConfigModule,
            providers: [
                {
                    provide: CoreConfigService,
                    useValue: new CoreConfigService(factory),
                },
            ],
            exports: [CoreConfigService],
        };
    }
}

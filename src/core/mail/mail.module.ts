import { Global, Module } from '@nestjs/common';
import { CoreConfigService } from '../config/index.js';
import { SesConfig } from '../config/schemas/mail.ses.schema.js';
import { SmtpConfig } from '../config/schemas/mail.smtp.schema.js';
import { MailService } from './mail.service.js';

import { MailTransportRegistry } from './transport/mail.transport.registry.js';
import { SmtpTransport } from './transport/smtp.transport.js';
import { SesTransport } from './transport/ses.transport.js';

import { MailTemplateLoader } from './template/mail.template.loader.js';
import { MailTemplateRenderer } from './template/mail.template.renderer.js';

interface MailModuleConfig {
    mailTemplateDir: string;
    smtp?: SmtpConfig;
    ses?: SesConfig;
}

@Global()
@Module({
    providers: [
        MailTransportRegistry,
        {
            provide: MailTemplateLoader,
            inject: [CoreConfigService],
            useFactory: (config: CoreConfigService<MailModuleConfig>) =>
                new MailTemplateLoader({
                    templateDir: config.get().mailTemplateDir,
                }),
        },
        MailTemplateRenderer,
        {
            provide: 'MAIL_TRANSPORTS_INIT',
            inject: [CoreConfigService, MailTransportRegistry],
            useFactory: (
                config: CoreConfigService<MailModuleConfig>,
                registry: MailTransportRegistry
            ) => {
                const mailConfig = config.get();

                if (mailConfig.smtp) {
                    registry.register(
                        'smtp',
                        new SmtpTransport(mailConfig.smtp)
                    );
                }

                if (mailConfig.ses) {
                    registry.register('ses', new SesTransport(mailConfig.ses));
                }

                if (!mailConfig.smtp && !mailConfig.ses) {
                    throw new Error('No mail transport configured');
                }
            },
        },
        MailService,
    ],
    exports: [MailService],
})
export class MailModule {}

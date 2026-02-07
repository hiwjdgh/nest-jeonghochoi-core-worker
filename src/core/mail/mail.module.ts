import { Global, Module } from '@nestjs/common';
import { CoreConfigService } from '../config/config.service.js';
import { MailService } from './mail.service.js';
import { SmtpTransport } from './transport/smtp.transport.js';
import { SesTransport } from './transport/ses.transport.js';

@Global()
@Module({
    providers: [
        {
            provide: 'MAIL_TRANSPORT',
            inject: [CoreConfigService],
            useFactory: (config: CoreConfigService<any>) => {
                const cfg = config.get();
                if (cfg.smtp) return new SmtpTransport(cfg.smtp);
                if (cfg.ses) return new SesTransport(cfg.ses);
                throw new Error('Mail transport config missing');
            },
        },
        {
            provide: MailService,
            inject: ['MAIL_TRANSPORT', CoreConfigService],
            useFactory: (transport, config) =>
                new MailService(transport, config.get().mailTemplateDir),
        },
    ],
    exports: [MailService],
})
export class MailModule {}

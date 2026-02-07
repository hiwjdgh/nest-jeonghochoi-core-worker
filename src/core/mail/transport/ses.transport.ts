import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { MailTransport } from './mail.transport.interface.js';
import { MailSendOptions } from '../mail.types.js';
import { SesConfig } from '../../config/schemas/mail.ses.schema.js';

export class SesTransport implements MailTransport {
    private client: SESClient;

    constructor(private readonly cfg: SesConfig) {
        this.client = new SESClient({ region: cfg.region });
    }

    async send(options: MailSendOptions) {
        const to = Array.isArray(options.to) ? options.to : [options.to];
        const cc = options.cc
            ? Array.isArray(options.cc)
                ? options.cc
                : [options.cc]
            : [];

        await this.client.send(
            new SendEmailCommand({
                Source: this.cfg.from,
                Destination: { ToAddresses: to, CcAddresses: cc },
                Message: {
                    Subject: { Data: options.subject },
                    Body: {
                        Html: { Data: options.html ?? '' },
                    },
                },
            })
        );
    }
}

import { Injectable } from '@nestjs/common';
import { MailSendOptions } from './mail.types.js';
import { MailTransport } from './transport/mail.transport.interface.js';
import { loadTemplate } from './template/template.loader.js';
import { renderTemplate } from './template/template.engine.js';

@Injectable()
export class MailService {
    constructor(
        private readonly transport: MailTransport,
        private readonly templateDir?: string
    ) {}

    async send(options: MailSendOptions) {
        let html = options.html;

        if (options.template && this.templateDir) {
            const source = await loadTemplate(
                this.templateDir,
                options.template
            );
            html = renderTemplate(source, options.data ?? {});
        }

        await this.transport.send({ ...options, html });
    }
}

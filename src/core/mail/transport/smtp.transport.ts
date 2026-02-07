import nodemailer from 'nodemailer';
import { MailTransport } from './mail.transport.interface.js';
import { MailSendOptions } from '../mail.types.js';
import { SmtpConfig } from '../../config/schemas/mail.smtp.schema.js';

export class SmtpTransport implements MailTransport {
    private transporter;

    constructor(private readonly config: SmtpConfig) {
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.password,
            },
        });
    }

    async send(options: MailSendOptions) {
        await this.transporter.sendMail({
            from: this.config.from,
            to: options.to,
            cc: options.cc,
            subject: options.subject,
            html: options.html,
        });
    }
}

import { MailSendOptions } from '../mail.types.js';

export interface MailTransport {
    send(options: MailSendOptions): Promise<void>;
}

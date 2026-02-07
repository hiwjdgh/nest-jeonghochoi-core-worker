export interface MailSendOptions {
    to: string | string[];
    cc?: string | string[];
    subject: string;
    html?: string;
    template?: string;
    data?: Record<string, any>;
}

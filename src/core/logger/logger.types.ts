export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LoggerOptions {
    level: LogLevel;
    pretty?: boolean;
    service?: string;
}

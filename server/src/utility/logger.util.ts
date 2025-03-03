import env from '../../env';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const configRotateFile = {
    dirname: 'logs',
    maxFiles: '60d',
    zippedArchive: true,
};

const logFormat = winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`);

const fileLogger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), logFormat),
    transports: [
        new DailyRotateFile({ ...configRotateFile, filename: 'error.%DATE%.log', level: 'error' }),
        new DailyRotateFile({ ...configRotateFile, filename: 'combined.%DATE%.log', level: 'info' }),
    ],
});

const consoleLogger = winston.createLogger({
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
    level: 'debug',
});

class Logger {
    scope = '';
    constructor(scope?: string) {
        this.scope = scope || 'App';
    }

    debug(message: string, label?: string, ...rest: any) {
        this.log('debug', message, label, rest);
    }

    info(message: string, label?: string, ...rest: any) {
        this.log('info', message, label, rest);
    }

    warn(message: string, label?: string, ...rest: any) {
        this.log('warn', message, label, rest);
    }

    error(message: string, label?: string, ...rest: any) {
        this.log('error', message, label, rest);
    }

    log(level: string, message?: string, ...rest: any) {
		const formattedMessage = `${this.formatScope()} ${message}`;
    	fileLogger[level as keyof typeof fileLogger](formattedMessage, rest);
    	if (env.app.debugLog) this.cli(level, message, rest);
    }

    cli(level: string, message?: string, ...rest: any) {
        consoleLogger[level as keyof typeof consoleLogger](message, rest);
    }

    formatScope(label?: string) {
        return label || this.scope;
    }
}

export default new Logger();

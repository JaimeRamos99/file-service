// logger.ts
import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';

/**
 * Type for additional contextual information.
 */
type Bindings = Record<string, unknown>;

/**
 * Logger class utilizing Pino for logging.
 */
class Logger {
  private logger: PinoLogger;

  constructor(loggerInstance?: PinoLogger) {
    if (loggerInstance) {
      this.logger = loggerInstance;
    } else {
      const isProduction = process.env.NODE_ENV === 'production';

      // Configure Pino
      const options: LoggerOptions = {
        level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
        transport: !isProduction
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
        // Add more Pino configurations here if needed
      };

      this.logger = pino(options);
    }
  }

  /**
   * Logs an info level message.
   * @param msg - The log message.
   * @param bindings - Additional contextual information.
   */
  public info(msg: string, bindings: Bindings = {}): void {
    this.logger.info(bindings, msg);
  }

  /**
   * Logs a debug level message.
   * @param msg - The log message.
   * @param bindings - Additional contextual information.
   */
  public debug(msg: string, bindings: Bindings = {}): void {
    this.logger.debug(bindings, msg);
  }

  /**
   * Logs an error level message.
   * @param msg - The log message.
   * @param error - The error object.
   * @param bindings - Additional contextual information.
   */
  public error(msg: string, error: Error | null = null, bindings: Bindings = {}): void {
    if (error) {
      this.logger.error({ ...bindings, err: error }, msg);
    } else {
      this.logger.error(bindings, msg);
    }
  }

  /**
   * Creates a child logger with additional bindings.
   * @param bindings - Contextual information to bind to the child logger.
   * @returns A new Logger instance with the child logger.
   */
  public child(bindings: Bindings): Logger {
    const childLogger = this.logger.child(bindings);
    return new Logger(childLogger);
  }
}

// Export a singleton instance
const loggerInstance = new Logger();
export default loggerInstance;

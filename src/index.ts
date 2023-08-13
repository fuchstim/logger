import { ConsoleTransport } from './transports/console';
import { ILogTransport, TLogFragment, TLogLevel } from './types';

export type TLoggerOptions = {
  /** Prefix to be added to all log messages */
  prefix?: string;
  /** List of log transports implementing {@link ILogTransport}. Defaults to {@link ConsoleTransport}. */
  transports?: ILogTransport[];
};

export { TLogLevel, ILogTransport } from './types';
export { ConsoleTransport } from './transports/console';

/**
 * @example
 * ```typescript
 * import Logger from '@ftim/logger';
 * 
 * Logger.info('Hello world!');
 * // Prints: (info) Hello world!
 * 
 * Logger.ns('my-namespace').info('Hello world!');
 * // Prints: (info)[my-namespace] Hello world!
 * ```
 */
export class Logger implements ILogTransport {
  private prefix?: string;
  private transports: ILogTransport[];

  constructor(options?: TLoggerOptions) {
    this.prefix = options?.prefix;
    this.transports = options?.transports ?? [ new ConsoleTransport({ color: true, json: false, }), ];
  }

  /** Set prefix after initialization */
  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  /** Set prefix after initialization */
  setTransports(transports: ILogTransport[]) {
    this.transports = transports;
  }

  /** Alias of `namespace` */
  ns(...namespaces: string[]) { return this.namespace(...namespaces); }

  /** Create or or more child logger instances */
  namespace(...namespaces: string[]) {
    if (!namespaces.length) {
      return this;
    }

    return namespaces.reduce(
      (logger, prefix) => new Logger({ prefix, transports: [ logger, ], }),
      this as Logger
    );
  }

  /** Log a message with level `error` */
  error(...fragments: TLogFragment[]) { this.log('error', [], fragments); }
  
  /** Log a message with level `warn` */
  warn(...fragments: TLogFragment[]) { this.log('warn', [], fragments); }

  /** Log a message with level `info` */
  info(...fragments: TLogFragment[]) { this.log('info', [], fragments); }

  /** Log a message with level `debug` */
  debug(...fragments: TLogFragment[]) { this.log('debug', [], fragments); }

  /** Log a message with an arbitrary log level and prefix */
  async log(level: TLogLevel, prefixes: string[], fragments: TLogFragment[]): Promise<void> {
    if (this.prefix) { prefixes.unshift(this.prefix); }

    await Promise.all(
      this.transports.map(
        transport => transport.log(level, prefixes, fragments)
      )
    );
  }
}

/** @hidden */
const defaultInstance = new Logger();
export default defaultInstance;

module.exports = defaultInstance;
module.exports.Logger = Logger;

import { ConsoleTransport } from './transports/console';
import { ILogTransport, TLogFragment, TLogLevel } from './types';

export type TLoggerOptions = {
  prefix?: string;
  transports?: ILogTransport[];
};

export { TLogLevel, ILogTransport } from './types';
export { ConsoleTransport } from './transports/console';

export class Logger implements ILogTransport {
  private prefix?: string;
  private transports: ILogTransport[];

  constructor(options?: Partial<TLoggerOptions>) {
    this.prefix = options?.prefix;
    this.transports = options?.transports ?? [ new ConsoleTransport({ color: true, json: false, }), ];
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  setTransports(transports: ILogTransport[]) {
    this.transports = transports;
  }

  ns(...namespaces: string[]) { return this.namespace(...namespaces); }

  namespace(...namespaces: string[]) {
    if (!namespaces.length) {
      return this;
    }

    return namespaces.reduce(
      (logger, prefix) => new Logger({ prefix, transports: [ logger, ], }),
      this as Logger
    );
  }

  error(...args: TLogFragment[]) { this.log('error', args); }
  warn(...args: TLogFragment[]) { this.log('warn', args); }
  info(...args: TLogFragment[]) { this.log('info', args); }
  debug(...args: TLogFragment[]) { this.log('debug', args); }

  async log(level: TLogLevel, fragments: TLogFragment[]): Promise<void>;
  async log(level: TLogLevel, fragments: TLogFragment[], prefixes: string[] = []): Promise<void> {
    if (this.prefix) { prefixes.unshift(this.prefix); }

    await Promise.all(
      this.transports.map(
        transport => transport.log(level, fragments, prefixes)
      )
    );
  }
}

const defaultInstance = new Logger();
export default defaultInstance;

module.exports = defaultInstance;
module.exports.Logger = Logger;

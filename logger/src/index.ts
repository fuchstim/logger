import util from 'util';

type TLoggerOptions = {
  prefix: string;
  color: boolean;
  transport: TLogTransport;
};
type TLogFragment = string | number | symbol | boolean | null | undefined | Error | object;
type TLogLevel = 'debug' | 'info' | 'warn' | 'error';

type TLogTransport = Record<TLogLevel, (message: string) => void>;

export class Logger {
  private options: TLoggerOptions;

  constructor(options?: Partial<TLoggerOptions>) {
    this.options = {
      color: true,
      prefix: '',
      transport: console,

      ...options,
    };
  }

  ns(...namespaces: string[]) { return this.namespace(...namespaces); }

  namespace(...namespaces: string[]) {
    return new Logger({
      ...this.options,

      prefix: [
        this.options.prefix,
        ...namespaces.map(ns => `[${ns}]`),
      ].join('').trim(),
    });
  }

  log(...args: TLogFragment[]): void;
  log(level: TLogLevel, ...args: TLogFragment[]) {
    this[level ?? 'info'](...args);
  }

  error(...args: TLogFragment[]) { this.writeLog('error', args); }
  warn(...args: TLogFragment[]) { this.writeLog('warn', args); }
  info(...args: TLogFragment[]) { this.writeLog('info', args); }
  debug(...args: TLogFragment[]) { this.writeLog('debug', args); }

  protected writeLog(level: TLogLevel, fragments: TLogFragment[]) {
    const formattedFragments = [ this.options.prefix, ...fragments, ]
      .map(fragment => {
        if ([ 'string', 'boolean', 'number', ].includes(typeof fragment)) {
          return String(fragment);
        }

        return util.inspect(
          fragment,
          {
            showHidden: false,
            depth: 5,
            colors: this.options.color,
          }
        );
      })
      .filter(fragment => Boolean(fragment.length));

    const message = [ `[${level}]`, ...formattedFragments, ].join(' ');

    this.options.transport[level].apply(
      this.options.transport,
      [ message, ]
    );
  }
}

const defaultInstance = new Logger();
export default defaultInstance;

module.exports = defaultInstance;
module.exports.Logger = Logger;

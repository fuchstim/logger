import util from 'util';

import chalk from 'chalk';

import { ILogTransport, TLogFragment, TLogLevel } from '../types';

export type TConsoleTransportOptions = {
  /** Minimum log level to be printed */
  logLevel?: TLogLevel;
  /** Whether to apply color to log messages. Ignored if `json: true` */
  color?: boolean;
  /** Whether to log messages as JSON */
  json?: boolean;
  /** Options to pass to `util.inspect` when serializing objects */
  inspectOptions?: util.InspectOptions;
};

const SORTED_LOG_LEVELS: TLogLevel[] = [
  'debug',
  'info',
  'warn',
  'error'
];

export class ConsoleTransport implements ILogTransport {
  private options: Required<TConsoleTransportOptions>;

  constructor(options: TConsoleTransportOptions = {}) {
    this.options = {
      logLevel: 'info',
      color: true,
      json: false,
      inspectOptions: {
        showHidden: false,
        depth: 5,
        colors: options.color ?? true,
        ...options.inspectOptions,
      },
      ...options
    };
  }

  log(level: TLogLevel, prefixes: string[], fragments: TLogFragment[]): void | Promise<void> {
    if (SORTED_LOG_LEVELS.indexOf(level) < SORTED_LOG_LEVELS.indexOf(this.options.logLevel)) {
      return;
    }

    if (this.options.json) {
      return this.logJson(level, prefixes, fragments);
    }

    return this.logPlain(level, prefixes, fragments);
  }

  private logJson(level: TLogLevel, prefixes: string[], fragments: TLogFragment[]): void {
    const message = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      fragments,
      prefixes,
    });

    console[level](message);
  }

  private logPlain(level: TLogLevel, prefixes: string[], fragments: TLogFragment[]): void {
    const formattedFragments = fragments
      .map(fragment => {
        if (['string', 'boolean', 'number',].includes(typeof fragment)) {
          return String(fragment);
        }

        return util.inspect(
          fragment,
          this.options.inspectOptions,
        );
      })
      .filter(fragment => Boolean(fragment.length));

    const formattedPrefixes = prefixes
      .map(prefix => `[${prefix}]`)
      .join('');

    const messagePrefix = `(${level})${formattedPrefixes}`;

    const message = [
      this.applyColor(level, messagePrefix),
      ...formattedFragments,
    ]
      .join(' ');

    console[level](message);
  }

  private applyColor(level: TLogLevel, message: string): string {
    if (!this.options.color) { return message; }

    const color = {
      debug: chalk.gray,
      info: chalk.green,
      warn: chalk.red,
      error: chalk.white.bgRed,
    }[level];

    return color(message);
  }
}

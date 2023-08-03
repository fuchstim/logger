import util from 'util';

import chalk from 'chalk';

import { ILogTransport, TLogFragment, TLogLevel } from '../types';

export type TConsoleTransportOptions = {
  color?: boolean;
  json?: boolean;
  inspectOptions?: util.InspectOptions;
};

export class ConsoleTransport implements ILogTransport {
  private options: TConsoleTransportOptions = {};

  constructor(options: TConsoleTransportOptions = {}) {
    this.options = options;
  }

  log(level: TLogLevel, fragments: TLogFragment[], prefixes: string[]): void | Promise<void> {
    if (this.options.json) {
      return this.logJson(level, fragments, prefixes);
    }

    return this.logPlain(level, fragments, prefixes);
  }

  private logJson(level: TLogLevel, fragments: TLogFragment[], prefixes: string[]): void {
    const message = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      fragments,
      prefixes,
    });

    console[level](message);
  }

  private logPlain(level: TLogLevel, fragments: TLogFragment[], prefixes: string[]): void {
    const formattedFragments = fragments
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
            ...this.options.inspectOptions,
          }
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

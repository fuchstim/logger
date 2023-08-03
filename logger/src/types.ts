export type TLogFragment = string | number | symbol | boolean | null | undefined | Error | object;
export type TLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ILogTransport {
  log(level: TLogLevel, fragments: TLogFragment[], prefixes: string[]): void | Promise<void>
}

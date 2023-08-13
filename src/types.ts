export type TLogFragment = string | number | symbol | boolean | null | undefined | Error | object;
export type TLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ILogTransport {
  log(level: TLogLevel, prefixes: string[], fragments: TLogFragment[]): void | Promise<void>
}

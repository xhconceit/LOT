export interface I18nError<K extends string = string> {
  readonly key: K;
  readonly params?: Record<string, string>;
}



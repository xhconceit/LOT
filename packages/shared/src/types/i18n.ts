export interface I18nError {
  readonly key: string;
  readonly params?: Record<string, string>;
}

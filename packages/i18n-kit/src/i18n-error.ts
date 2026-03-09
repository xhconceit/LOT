import type { I18nKey } from "@lot/i18n"
import type { I18nError } from "@lot/shared"

export function i18nError<K extends I18nKey>(key: K, params?: Record<string, string>): I18nError {
    return {
        key,
        params
    }
}

export function i18nKey<K extends I18nKey>(key: K): K {
    return key
}



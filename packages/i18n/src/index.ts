import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";
import type { I18nKey } from './keys'

export type { I18nKey }

export type Translation = typeof zhCN

export const resources = {
    "zh-CN": { translations: zhCN },
    en: { translations: en },
}

export type SupportedLanguage = keyof typeof resources

export function isSupportedLanguage(lng: string): lng is SupportedLanguage {
    return lng in resources
}

export function getTranslation(lng: SupportedLanguage): Translation {
    return resources[lng].translations
}



export function createTranslator(arg: {
    readonly translation: Translation
    readonly fallbackTranslation?: Translation
}) {
    const { translation, fallbackTranslation } = arg

    const getByPath = (obj: unknown, path: string): unknown => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cur: any = obj;
        for (const part of path.split('.')) {
            if (!cur || typeof cur !== "object") {
                return undefined
            }
            cur = cur[part]
        }
        return cur
    }

    function interpolate(template: string, params?: Record<string, string>): string {
        if (!params) {
            return template
        }
        return template.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? `{{${k}}}`)
    }

    return (key: I18nKey, params?: Record<string, string>) => {
        const v = getByPath(translation, key)
        if (typeof v === "string") {
            return interpolate(v, params)
        }
        const fv = fallbackTranslation ? getByPath(fallbackTranslation, key) : undefined
        if (typeof fv === "string") {
            return interpolate(fv, params)
        }
        return key
    }
}



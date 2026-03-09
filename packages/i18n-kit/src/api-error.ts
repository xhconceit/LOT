import type { I18nKey } from "@lot/i18n"
import type { I18nError } from "@lot/shared"
import { i18nError } from "./i18n-error"


export type ApiErrorCode =
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "RATE_LIMITED"
    | "INTERNAL_ERROR";

export type ApiErrorResponse = Readonly<{
    ok: false
    error: Readonly<{
        code: ApiErrorCode
        key: I18nKey
        params?: Record<string, string>
        details?: unknown
    }>
}>

export class ApiError extends Error {
    readonly status: number
    readonly code: ApiErrorCode
    readonly i18n: I18nError
    readonly details?: unknown
    constructor(args: {
        status: number
        code: ApiErrorCode
        i18n: I18nError
        details?: unknown
    }) {
        super(args.i18n.key)
        this.status = args.status
        this.code = args.code
        this.i18n = args.i18n
        this.details = args.details
    }
}

export function isApiError(x: unknown): x is ApiError {
    return x instanceof ApiError
}

export function toApiErrorResponse(err: unknown): Readonly<{ status: number, body: ApiErrorResponse }> {
    if (err instanceof ApiError) {
        return {
            status: err.status,
            body: {
                ok: false,
                error: {
                    code: err.code,
                    key: err.i18n.key as I18nKey,
                    params: err.i18n.params,
                    details: err.details,
                }
            }
        } as const
    }

    if (err && typeof err === "object" && "key" in err && typeof (err as unknown as I18nError).key === "string") {
        const e = err as I18nError
        return {
            status: 400,
            body: {
                ok: false,
                error: {
                    code: "VALIDATION_ERROR",
                    key: e.key as I18nKey,
                    params: e.params,
                }
            }
        } as const

    }

    const unknown = i18nError("error.unknown" as I18nKey)

    return {
        status: 500,
        body: {
            ok: false,
            error: {
                code: "INTERNAL_ERROR",
                key: unknown.key as I18nKey,
                params: unknown.params,
            }
        }
    }
}

export const apiError = {
    /**
     * 验证错误
     * @param i18n - 国际化错误
     * @param details - 错误详情
     * @returns 验证错误
     */
    validation(i18n: I18nError, details?: unknown){
        return new ApiError({
            status: 400,
            code: "VALIDATION_ERROR",
            i18n,
            details
        })
    },
    /**
     * 未授权错误
     * @param i18n - 国际化错误
     * @param details - 错误详情
     * @returns 未授权错误
     */
    unauthorized(i18n: I18nError = i18nError("error.unknown" as I18nKey), details?: unknown) {
        return new ApiError({
            status: 401,
            code: "UNAUTHORIZED",
            i18n,
            details
        })
    },
    /**
     * 无权限错误
     * @param i18n - 国际化错误
     * @param details - 错误详情
     * @returns 无权限错误
     */
    forbidden(i18n: I18nError = i18nError("error.unknown" as I18nKey), details?: unknown) {
        return new ApiError({
            status: 403,
            code: "FORBIDDEN",
            i18n,
            details
        })
    },
    /**
     * 未找到错误
     * @param i18n - 国际化错误
     * @param details - 错误详情
     * @returns 未找到错误
     */
    notFound(i18n: I18nError, details?: unknown) {
        return new ApiError({
            status: 404,
            code: "NOT_FOUND",
            i18n,
            details
        })
    },
    /**
     * 冲突错误
     * @param i18n - 国际化错误
     * @param details - 错误详情
     * @returns 冲突错误
     */
    conflict(i18n: I18nError, details?: unknown) {
        return new ApiError({
            status: 409,
            code: "CONFLICT",
            i18n,
            details
        })
    },
    /**
     * 请求过多错误
     * @param i18n - 国际化错误
     * @param details - 错误详情
     * @returns 请求过多错误
     */
    rateLimited(i18n: I18nError, details?: unknown) {
        return new ApiError({
            status: 429,
            code: "RATE_LIMITED",
            i18n,
            details
        })
    },
    /**
     * 内部错误
     * @param i18n - 国际化错误
     * @param details - 错误详情
     * @returns 内部错误
     */
    internal(i18n: I18nError, details?: unknown) {
        return new ApiError({
            status: 500,
            code: "INTERNAL_ERROR",
            i18n,
            details
        })
    },
} as const

 
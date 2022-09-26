import {CertLogicExpression, evaluate} from "certlogic-js"

export const pretty = (json: any) =>
    JSON.stringify(json, null, 2)

export const tryParse = (text: string) => {
    try {
        return JSON.parse(text)
    } catch (e) {
        return e
    }
}

export const evaluateSafe = (expr: CertLogicExpression, data: any) => {
    try {
        return evaluate(expr, data)
    } catch (e) {
        return `Error occurred during evaluation: ${e}.`    // TODO  -> e.message
    }
}

export const minify = (text: string) =>
    JSON.stringify(JSON.parse(text))

export const parseOrNull = (text: string | null) =>
    text === null ? null : JSON.parse(text)


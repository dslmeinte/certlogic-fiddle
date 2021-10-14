import React from "react"
import {useState} from "react"
import ReactDOM from "react-dom"
import {evaluate, implementationVersion, specificationVersion} from "certlogic-js"
import {dataAccessesWithContext, validateFormat} from "certlogic-js/dist/validation"
import {CompactExprRendering} from "certlogic-html"

import "./styling.css"
import "certlogic-html/dist/styling.css"


const pretty = (json) => JSON.stringify(json, null, 2)

const tryParse = (text) => {
    try {
        return JSON.parse(text)
    } catch (e) {
        return e
    }
}

const evaluateSafe = (expr, data) => {
    try {
        return evaluate(expr, data)
    } catch (e) {
        return `Error occurred during evaluation: ${e.message}.`
    }
}


const ReactiveTextArea = ({ id, value, setter }) =>
    <textarea
        id={id}
        onChange={(event) => setter(event.target.value)}
        value={value} />


const App = () => {
    const params = new URLSearchParams(location.search)

    const [exprAsText, setExprAsText] = useState(params.get("expr") || pretty({ var: "" }))
    const [dataAsText, setDataAsText] = useState(params.get("data") || pretty({}))

    const expr = tryParse(exprAsText)
    const exprIsJson = !(expr instanceof Error)
    const validationErrors = exprIsJson
        ? validateFormat(expr)
        : [ { expr, message: `Could not parse expression text as JSON: ${expr.message}.` } ]
    const exprIsValid = validationErrors.length === 0

    const data = tryParse(dataAsText)
    const evaluation = (data instanceof Error)
        ? `Could not parse data text as JSON: ${data.message}.`
        : (
            exprIsValid
                ? evaluateSafe(expr, data)
                : `(Did not run evaluation because expression is not valid.)`
        )

    const [beenShared, setBeenShared] = useState(false)

    const copyShareableUrlToClipboard = async () => {
        const params = new URLSearchParams()
        params.append("expr", exprAsText)
        params.append("data", dataAsText)
        await navigator.clipboard.writeText(`${location.origin}/?${params}`)
        setBeenShared(true)
    }

    return <main>
        <h1>CertLogic Fiddle</h1>
        <p>
            In this playground you can fiddle around with <a href="https://github.com/ehn-dcc-development/dgc-business-rules/blob/main/certlogic/README.md">CertLogic</a>.
            In the text input boxes below you can enter JSON text representing a CertLogic logical expression, as well as input data.
            The expression is validated and evaluated live with the given data.
            Also, all possible data accesses are computed, and a compact notation of the expression is shown.
        </p>
        <div className="wrapper">
            <div>
                <span className="label">CertLogic expression</span>
                <ReactiveTextArea id="expr" value={exprAsText} setter={setExprAsText} />
            </div>
            <div>
                <span className="label">Validation errors</span>
                {validationErrors.length === 0 && <p>(None.)</p>}
                {validationErrors.length === 1 && <p>{validationErrors[0].message}</p>}
                {validationErrors.length > 1 && <ol>{validationErrors.map((error, index) => <li key={index}>{error.message}</li>)}</ol>}
            </div>
            <div>
                <span className="label">Data</span>
                <ReactiveTextArea id="data" value={dataAsText} setter={setDataAsText} />
            </div>
            <div>
                <div>
                    <span className="label">Evaluation result</span>
                </div>
                {typeof evaluation === "string" ? <p>{evaluation}</p> : <pre>{pretty(evaluation)}</pre>}
            </div>
            <div>
                <button onClick={copyShareableUrlToClipboard}>Copy shareable URL to clipboard</button>
                <span
                    className={"push-right " + (beenShared ? "fade-out" : "hidden")}
                    onAnimationEnd={() => { setBeenShared(false) }}
                >Copied!</span>
            </div>
            <div></div>
            {exprIsValid &&
                <div>
                    <span className="label">Data accesses</span>
                    <pre>{pretty(dataAccessesWithContext(expr))}</pre>
                </div>
            }
            {exprIsValid &&
                <div>
                    <span className="label">Expression in compact notation</span>
                    <div>
                        <CompactExprRendering expr={expr} />
                    </div>
                </div>
            }
        </div>
        <p>
            CertLogic JS implementation version: <span className="strong">{implementationVersion}</span> (NPM package <a href="https://www.npmjs.com/package/certlogic-js" target="_blank"><tt>certlogic-js</tt></a>)<br/>
            CertLogic specification version: <span className="strong">{specificationVersion}</span>
        </p>
        <p>
            CertLogic has been developed by the <a href="https://ec.europa.eu/health/ehealth/policy/network_en">European Health Network</a> (eHN), as part of the <a href="https://ec.europa.eu/info/live-work-travel-eu/coronavirus-response/safe-covid-19-vaccines-europeans/eu-digital-covid-certificate_en">EU Digital COVID Certificate effort</a>.
        </p>
    </main>
}


ReactDOM.render(<App />, document.getElementById('root'))


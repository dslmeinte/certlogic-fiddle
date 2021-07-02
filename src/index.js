import React from "react"
import {useState} from "react"
import ReactDOM from "react-dom"
import {evaluate} from "certlogic-js"
import {validateFormat} from "certlogic-validation"

import "./styling.css"


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
    const [exprAsText, setExprAsText] = useState(pretty({ var: "" }))
    const [dataAsText, setDataAsText] = useState(pretty({}))

    const expr = tryParse(exprAsText)
    const validation = (expr instanceof Error)
        ? `Could not parse expression text as JSON: ${expr.message}.`
        : validateFormat(expr)
    const exprHasValidationErrors = Array.isArray(validation) && validation.length > 0

    const data = tryParse(dataAsText)
    const evaluation = (data instanceof Error)
        ? `Could not parse data text as JSON: ${data.message}.`
        : (
            expr instanceof Error || exprHasValidationErrors
                ? `(Did not run evaluation due to earlier problems.)`
                : evaluateSafe(expr, data)
        )

    return <main>
        <h1>CertLogic Fiddle</h1>
        <p>
            In this playground you can fiddle around with <a href="https://github.com/ehn-dcc-development/dgc-business-rules/blob/main/certlogic/README.md">CertLogic</a>.
            In the text input boxes below you can enter JSON text representing a CertLogic logical expression, as well as input data.
            The expression is validated and evaluated live with the given data.
        </p>
        <div className="wrapper">
            <div>
                <span className="label">CertLogic expression</span>
                <ReactiveTextArea id="expr" value={exprAsText} setter={setExprAsText} />
            </div>
            <div>
                <span className="label">Validation errors</span>
                {Array.isArray(validation)
                    ? (validation.length === 0) ? <p>(None.)</p> : <ol>{validation.map((error, index) => <li key={index}>{error.message}</li>)}</ol>
                    : <p>{validation}</p>
                }
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
        </div>
        <p>
            CertLogic has been developed by the <a href="https://ec.europa.eu/health/ehealth/policy/network_en">European Health Network</a> (eHN), as part of the <a href="https://ec.europa.eu/info/live-work-travel-eu/coronavirus-response/safe-covid-19-vaccines-europeans/eu-digital-covid-certificate_en">EU Digital COVID Certificate effort</a>.
        </p>
    </main>
}


ReactDOM.render(<App />, document.getElementById('root'))


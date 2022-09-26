import React from "react"
import {useState} from "react"
import ReactDOM from "react-dom"
import {implementationVersion, specificationVersion} from "certlogic-js"
import {validateFormat} from "certlogic-js/dist/validation"
import {CompactExprRendering} from "certlogic-html"

import "./styling.css"
import "certlogic-html/dist/styling.css"

import {
    evaluateSafe,
    minify,
    parseOrNull,
    pretty,
    tryParse
} from "./json-utils"


const ownVersion = require("../package.json").version


const ReactiveTextArea = ({ id, value, setter }: { id: string, value: string, setter: (newValue: string) => void }) =>
    <textarea
        id={id}
        onChange={(event) => setter(event.target.value)}
        value={value} />


const App = () => {
    const params = new URLSearchParams(location.search)

    console.log(params.get("expr"))
    const [exprAsText, setExprAsText] = useState(pretty(parseOrNull(params.get("expr")) || ({ var: "" })))
    const [dataAsText, setDataAsText] = useState(pretty(parseOrNull(params.get("data")) || ({})))

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
        params.append("expr", minify(exprAsText))
        params.append("data", minify(dataAsText))
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
            {exprIsValid &&
                <>
                    <div>
                        <span className="label">Expression in compact notation</span>
                        <div>
                            <CompactExprRendering expr={expr} />
                        </div>
                    </div>
                    <div></div>
                </>
            }
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
        </div>
        <p>
            <a href="https://github.com/ehn-dcc-development/eu-dcc-business-rules/tree/main/certlogic/certlogic-js" target="_blank">CertLogic JS implementation</a> version: <span className="strong">{implementationVersion}</span> (NPM package <a href="https://www.npmjs.com/package/certlogic-js" target="_blank"><span className="tt">certlogic-js</span></a>)<br/>
            <a href="https://github.com/ehn-dcc-development/eu-dcc-business-rules/tree/main/certlogic/specification" target="_blank">CertLogic specification</a> version: <span className="strong">{specificationVersion}</span><br/>
            Version of this playground: <span className="strong">{ownVersion}</span> (<a href="https://github.com/dslmeinte/certlogic-fiddle" target="_blank">GitHub repo</a>)
        </p>
        <p>
            CertLogic has been developed by the <a href="https://ec.europa.eu/health/ehealth/policy/network_en">European Health Network</a> (eHN), as part of the <a href="https://ec.europa.eu/info/live-work-travel-eu/coronavirus-response/safe-covid-19-vaccines-europeans/eu-digital-covid-certificate_en">EU Digital COVID Certificate effort</a>.
        </p>
    </main>
}


ReactDOM.render(<App />, document.getElementById("root"))


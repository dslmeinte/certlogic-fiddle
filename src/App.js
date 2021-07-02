import React from 'react';
import {useState} from 'react';
import './App.css';
import {evaluate} from "certlogic-js";


const ReactiveTextArea = (id, value, setter) =>
    <textarea id={id} onChange={(event) => setter(JSON.parse(event.target.value))}>{JSON.stringify(value, null, 2)}</textarea>

function App() {
    const [expr, setExpr] = useState({"var": ""})
    const [data, setData] = useState({})
    return (
        <main>
            <h1>CertLogic Fiddle</h1>
            <div>
                <label for="expr">CertLogic expression</label>
                <ReactiveTextArea id="expr" value={expr} setter={setExpr} />
                <label for="data">Data</label>
                <ReactiveTextArea id="data" value={data} setter={setData} />
                <pre>{JSON.stringify(evaluate(expr, data), null, 2)}</pre>
            </div>
        </main>
    );
}

export default App;


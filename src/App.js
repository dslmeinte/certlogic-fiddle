import React from 'react';
import {useState} from 'react';
import './App.css';
import {evaluate} from "certlogic-js";

function App() {
    const [expr, setExpr] = useState({"var": ""})
    const [data, setData] = useState({})
    return (
        <main>
            <h1>CertLogic Fiddle</h1>
            <div>
                <label for="expr">CertLogic expression:</label>
                <textarea id="expr"
                          onChange={(event) => setExpr(JSON.parse(event.target.value))}>{JSON.stringify(expr, null, 2)}</textarea>
                <label for="data">Data</label>
                <textarea id="data"
                          onChange={(event) => setData(JSON.parse(event.target.value))}>{JSON.stringify(data, null, 2)}</textarea>
                <pre>{JSON.stringify(evaluate(expr, data), null, 2)}</pre>
            </div>
        </main>
    );
}

export default App;


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, HashRouter} from "react-router-dom";
import store from "./redux/Redux-Store";
import {Provider} from "react-redux";
import App from "./App";
import "./css/app.css"

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
    root.render(
        <React.StrictMode>
            <HashRouter>
                <Provider store={store} >
                    <App/>
                </Provider>
            </HashRouter>

        </React.StrictMode>
    );

import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, HashRouter} from "react-router-dom";
import store from "./redux/Redux-Store";
import {Provider} from "react-redux";
import App from "./App";
import "./css/app.css"

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

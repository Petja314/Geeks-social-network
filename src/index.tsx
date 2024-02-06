import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter} from "react-router-dom";
import store from "./redux/Redux-Store";
import {Provider} from "react-redux";
import AppComp from "./AppComp";
// import "./index.css"
import "./css/app.css"

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
// state: MyMainState
// let rerenderEntireTree = () => {
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Provider store={store} >
                    <AppComp/>
                    {/*<App/>*/}
                </Provider>
            </BrowserRouter>

        </React.StrictMode>
    );

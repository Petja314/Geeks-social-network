import React, {useEffect} from 'react';
import {Route, Routes, useLocation} from "react-router-dom";
import HeaderContainer from "./components/header/HeaderContainer";
import {useDispatch, useSelector} from "react-redux";
import {initializeApp} from "./redux/AppReducer";
import Preloader from "./common/preloader/Preloader";
import SideBar from "./components/sidebar/SideBar";
import "./css/app.css"
import Footer from "./components/footer/Footer";
import checkLocation from './common/helpers/checkLocation';
import checkInnerWidth from './common/helpers/checkInnerWidth';
import {navigationRoutes} from "./routes/NavigationRoutes";

const App = () => {
    const initialized = useSelector((state: any) => state.app.initialized)
    const dispatch: any = useDispatch();

    const { pathname } = useLocation();
    console.log(pathname)

    useEffect(() => {
        dispatch(initializeApp());
    }, [dispatch]);

    if (!initialized) {
        return <Preloader isFetching={true} />
    }

    return (
        <div className="app_wrapper">
            <HeaderContainer />
            <SideBar />
            <div className="main">
                <div className="container_main">
                    <Routes>
                        {
                            navigationRoutes.map(item => (
                                    <Route path={item.path} element={item.element} key={item.name}/>
                            ))
                        }
                    </Routes>
                </div>
            </div>

            {
                // logic to not display footer on mobile devices on certain pages.
                // Check for screen width
                checkInnerWidth(850) ?

                    // check for current url path
                    checkLocation(pathname, ["dialogs", "login", "ask_ai", "flood_chat"]) ?
                        // show nothing
                        ""
                        :
                        // show footer
                        <Footer />
                    :
                    // show footer
                    <Footer />
            }
        </div>
    );
};
export default App




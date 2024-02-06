import React from "react";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AuthState, logoutThunk} from "../../redux/AuthReducer";
import {RootState} from "../../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import "../../css/app.css"
import logo from "../../assets/images/logo/giphy.png"
import "../../css/header.css"


function HeaderContainer() {
    const {login, isAuth}: AuthState = useSelector((state: RootState) => state.userAuthPage)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    // console.log('login' , login)
    return (
        <header className="header">


            <div className="header_logo_text">
                GEEKS <img src={logo} alt="geeks_logo"/> NETWORK
            </div>


            <div className="header_login">
                {isAuth ? (
                    <button onClick={() => dispatch(logoutThunk())}>
                        {login} - Log out
                    </button>
                ) : (
                    <button className="multi_button">
                        <NavLink to={"/login"}>Login</NavLink>
                    </button>
                )}
            </div>
        </header>


    )
}

export default HeaderContainer;
import React, {useRef, useState} from "react";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AuthState, logoutThunk} from "../../redux/AuthReducer";
import {RootState} from "../../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import "../../css/app.css"
import logo from "../../assets/images/logo/giphy.png"
import "../../css/header/header.css"
import "../../css/sidebar/sidebar.css"
import SideBar from "../sidebar/SideBar";
import burgerMenu from "../../assets/images/icons/burgerbar.png"
import closeMenu from "../../assets/images/icons/closemenu.svg"
import userLogin from "../../assets/images/icons/userlogin.png"
import userLogOut from "../../assets/images/icons/logout.svg"

// function to check if passed screen width is more than actual one
import checkInnerWidth from "../../common/helpers/checkInnerWidth";

function HeaderContainer() {
    const { login, isAuth }: AuthState = useSelector((state: RootState) => state.userAuthPage)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const bodyRef = useRef<HTMLBodyElement>(document.querySelector("body"));

    const handleBurgerMenuClick = () => {
        // to disable y scroll while burger menu opened
        bodyRef.current?.classList.toggle("burgerMenuEnabled");
        setShowSidebar(!showSidebar);
    };

    const handleLinkClick = () => {

        bodyRef.current?.classList.toggle("burgerMenuEnabled");

        setShowSidebar(false)
    }
    return (
        <header className="header">
            {/*BURGER MENU*/}
            <div className="header_burger_menu" onClick={handleBurgerMenuClick}>
                {!showSidebar ? <div>
                    <img src={burgerMenu} alt="" />
                </div> :
                    <div>
                        <img className="close_mobile_menu" src={closeMenu} alt="" />
                    </div>
                }
            </div>

            {
                checkInnerWidth(1025) ?
                    <div className={`sidebar_show ${showSidebar ? "sidebar_show-active" : ""}`}>
                        <div className="header_burger_menu">
                            <img src={burgerMenu} alt="" onClick={handleBurgerMenuClick} />
                        </div>
                        <SideBar show={showSidebar} handleLinkClick={handleLinkClick} />
                    </div>
                    :
                    ""
            }

            <a className="active" href="#/profile" aria-current="page">
                <div className="header_logo_text">
                    GEEKS <img src={logo} alt="geeks_logo" /> NETWORK
                </div>
            </a>

            <div className="header_login">
                {isAuth ? (
                    <div className="user_logout" onClick={() => dispatch(logoutThunk())}>
                        <button>
                            {login} - Log out
                        </button>
                        <img src={userLogOut} alt="user_login" />
                    </div>
                ) : (
                    <div>
                        <button id="loginBtn">
                            <NavLink to={"/login"}>
                                {
                                    checkInnerWidth(1025) ?
                                    <img src={userLogin} alt="login" /> 
                                    :
                                    "Login"
                                }
                            </NavLink>
                        </button>
                    </div>
                )}
            </div>
        </header >
    )
}

export default HeaderContainer;
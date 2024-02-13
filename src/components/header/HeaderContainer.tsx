import React, {useState} from "react";
import {Navigate, NavLink} from "react-router-dom";
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
import userLogin from "../../assets/images/icons/userlogin.svg"
import userLogOut from "../../assets/images/icons/logout.svg"

function HeaderContainer() {
    const {login, isAuth}: AuthState = useSelector((state: RootState) => state.userAuthPage)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const [showSidebar, setShowSidebar] = useState<boolean>(false);

    const handleBurgerMenuClick = () => {
        setShowSidebar(!showSidebar);
    };

    const handleLinkClick = () => {
        setShowSidebar(false)
    }
    return (
        <header className="header">
            {/*BURGER MENU*/}
            <div className="header_burger_menu" onClick={handleBurgerMenuClick}>
                {!showSidebar ? <div>
                        <img src={burgerMenu} alt=""/>
                    </div> :
                    <div>
                        <img className="close_mobile_menu" src={closeMenu} alt=""/>
                    </div>
                }
            </div>

            {showSidebar && (
                <div className="sidebar_show">
                    <div className="header_burger_menu">
                        <img src={burgerMenu} alt="" onClick={handleBurgerMenuClick}/>
                    </div>
                    <SideBar show={showSidebar} handleLinkClick={handleLinkClick}/>
                </div>
            )}

            <a className="active" href="#/profile" aria-current="page">
                <div className="header_logo_text">
                    GEEKS <img src={logo} alt="geeks_logo"/> NETWORK
                </div>
            </a>

            <div className="header_login">
                {isAuth ? (
                    <div className="user_logout" onClick={() => dispatch(logoutThunk())}>
                        <button>
                            {login} - Log out
                        </button>
                        <img src={userLogOut} alt="user_login"/>
                    </div>
                ) : (
                    <div>
                        <button>
                            <NavLink to={"/login"}>Login</NavLink>
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default HeaderContainer;
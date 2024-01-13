import React from "react";
import {connect} from "react-redux";
import {getAuthUserData, logout} from "../redux/AuthReducer";
import header_classes from "./Header.module.css"

import {usersAPI} from "../../api/UsersAPI";
import {RootState} from "../redux/Redux-Store";
import HeaderComponent from "./Header";

class HeaderContainer extends React.Component<any, any> {
    render() {
        return (
            // <div className={header_classes.header}>
            <div>
                <HeaderComponent{...this.props} />
            </div>
        )

    }
}
type MapStateType = {
    isAuth : boolean,
    login : string
}
type MapDispatchType = {
    logout : () => void
}
let mapStateToProps = (state: any): MapStateType => ({
    isAuth: state.userAuthPage.isAuth,
    login: state.userAuthPage.login
});
export default connect<MapStateType, MapDispatchType>(mapStateToProps, {logout})(HeaderContainer);

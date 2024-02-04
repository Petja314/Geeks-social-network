import React, {ComponentType, useState} from 'react';
import {Navigate} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../redux/Redux-Store";

let mapStateToPropsForRedirect = (state: any) => ({
    userAuthPage: state.userAuthPage.isAuth
})
type RedirectComponentProps = {
    userAuthPage: boolean; // Adjust the type accordingly
};
export const  WithAuthRedirect = (Component: any) => {
    class RedirectComponent extends React.Component <RedirectComponentProps> {
        render() {
            if (!this.props.userAuthPage) return <Navigate to='/login'/>;
            return <Component {...this.props}
            />
        }
    }

    let ConnectAuthRedirectComponent = connect(mapStateToPropsForRedirect)(RedirectComponent)
    return ConnectAuthRedirectComponent
};

import React, {ComponentType, useState} from 'react';
import {Navigate} from "react-router-dom";
import {connect} from "react-redux";

let mapStateToPropsForRedirect = (state: any) => ({
    userAuthPage: state.userAuthPage.isAuth
})
type RedirectComponentProps = {
    userAuthPage: boolean; // Adjust the type accordingly
};


export const WithAuthRedirect = (Component: ComponentType<any>) => {
    const RedirectComponent: React.FC<RedirectComponentProps> = (props) => {
        console.log('userAuthPage:', props.userAuthPage);
        if (!props.userAuthPage) return <Navigate to="/login" />;
        return <Component {...props} />;
    };

    return connect(mapStateToPropsForRedirect)(RedirectComponent);
};


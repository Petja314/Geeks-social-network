import React from 'react';
import {ResultCodeForCaptcha, ResultCodesEnum} from "../../api/Api";
import {ThunkAction} from "redux-thunk";
import {Dispatch} from "redux";
import {InferActionsTypes} from "./Redux-Store";
import {authAPI} from "../../api/AuthAPI";

// const SET_USER_DATA = 'samurai-network/auth/SET_USER_DATA'
// const CAPTCHA_IS_SUCCESS = 'samurai-network/auth/CAPTCHA_IS_SUCCESS'
//
// type SetUserAuthType = {
//     type: typeof SET_USER_DATA,
//     payload: {
//         userId: number | null,
//         login: string,
//         email: string,
//         isAuth: boolean,
//
//     },
// }
// export type captchaIsSuccessType = {
//     type: typeof CAPTCHA_IS_SUCCESS,
//     payload: {
//         captchaUrl: any
//     }
// }


export type AuthState = {
    id: number | null;
    email: string | null;
    login: string | null;
    isAuth: boolean;
    captchaUrl: string | null;
}
let initialState: AuthState = {
    id: null,
    email: null,
    login: null,
    isAuth: false,
    captchaUrl: null,
}
export type LoginAction = (email: string, password: string, rememberMe: boolean) => void;

// export type ActionUsersReducerType = SetUserAuthType | captchaIsSuccessType | ReturnType<typeof resetAuthUserData>;


export const AuthReducer = (state = initialState, action: ActionsTypes): AuthState => {
    switch (action.type) {
        case 'SET_USER_DATA' :
            return {
                ...state,
                ...action.payload,
                id: action.payload.userId
            };
        case 'CAPTCHA_IS_SUCCESS' :
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state;
    }
};

type ActionsTypes = InferActionsTypes<typeof actions>
export const actions = {
     setAuthUsersDataAC : (userId: number, login: string, email: string, isAuth: boolean) => ({
            type: 'SET_USER_DATA',
            payload: {userId, login, email, isAuth},
    }as const),
     resetAuthUserData : () => ({
            type: 'SET_USER_DATA',
            payload: {userId: null, login: null, email: null, isAuth: false}
    }as const),
     captchaSuccessAC : (captchaUrl: any) => ({
            type: 'CAPTCHA_IS_SUCCESS',
            payload: {captchaUrl}
    }as const)
}

type ThunkType = ThunkAction<Promise<void>, AuthState, unknown, ActionsTypes >
    // | ReturnType <typeof stopSubmit>>
export const getAuthUserData = () : ThunkType  => {
    return async (dispatch: any) => {
        let response = await authAPI.me()
        if (response.data.resultCode === ResultCodesEnum.Success) {
            let {id, login, email} = response.data.data
            dispatch(actions.setAuthUsersDataAC(id, login, email, true))
        }
    }
}
export const login = (email: string, password: string, rememberMe: boolean, captcha: null) : ThunkType   => {
   return async (dispatch  ) => {
        let response = await authAPI.login(email, password, rememberMe, captcha)
        if (response.data.resultCode === ResultCodesEnum.Success) {
            dispatch(getAuthUserData())
        } else if (response.data.resultCode === ResultCodeForCaptcha.CaptchaIsRequired) {
            dispatch(captchaThunk())
        }
    }
}

export const logout = () :ThunkType => async (dispatch) => {
    let response = await authAPI.logout()
    if (response.data.resultCode === ResultCodesEnum.Success) {
        dispatch(actions.resetAuthUserData())
    }
}
export const captchaThunk = () :ThunkType => async (dispatch) => {
    const response = await authAPI.captcha();
    const captchaUrl = response.data.url
    dispatch(actions.captchaSuccessAC(captchaUrl))
}

export default AuthReducer


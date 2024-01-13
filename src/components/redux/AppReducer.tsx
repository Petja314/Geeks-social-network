import React from 'react';
import {getAuthUserData} from "./AuthReducer";
import {ThunkAction} from "redux-thunk";
import {UsersComponentTypeArrays} from "./UsersReducer";
import {InferActionsTypes} from "./Redux-Store";

// const SET_INITIALIZED_SUCCESS = "samurai-network/AppReducer/SET_INITIALIZED_SUCCESS"
//
// type SetUserAuthType = {
//     type : typeof SET_INITIALIZED_SUCCESS,
// }
type AuthState = {
    initialized : boolean,
}
const initialState: AuthState = {
    initialized : false,
}
// export type ActionUsersReducerType = SetUserAuthType


export const AppReducer = (state = initialState, action: ActionsTypes) : AuthState => {
    switch (action.type) {
        case 'SET_INITIALIZED_SUCCESS' :
            return {
                ...state ,
                initialized : true
            }

        default:
            return state;
    }
};


//ACTION CREATORS - AC
type ActionsTypes = InferActionsTypes<typeof actions>


export const actions = {
    initializedSuccess : () => ({
            type : 'SET_INITIALIZED_SUCCESS',
    }as const)
}
// export const initializedSuccess = (): SetUserAuthType => {
//     return {
//         type : SET_INITIALIZED_SUCCESS,
//     }
// }


// Thunks
type ThunkType = ThunkAction<Promise<void>, AuthState, unknown, ActionsTypes>

export const initializeApp = () : ThunkType => (dispatch : any) : any => {
   let promise =  dispatch(getAuthUserData())
    Promise.all([promise])
        .then(() => {
        dispatch(actions.initializedSuccess())
    })
}

export default AppReducer


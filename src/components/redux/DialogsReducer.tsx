import React from 'react';
import {InferActionsTypes} from "./Redux-Store";
import {ThunkAction} from "redux-thunk";
// import {stopSubmit} from "redux-form";
import {AuthState} from "./AuthReducer";

const ADD_MESSAGE = 'samurai-network/dialogs_reducer/ADD-MESSAGE'

// export type AddMessageReduxAT = {
//     type: typeof ADD_MESSAGE
//     value : string
// }

// ACTION TYPES
// export type ActionDialogsReducerType =   AddMessageReduxAT
// INITIAL STATE TYPE
export type DialogsInitialStateType = {
    dialogs_data:  DialogsType[],
    data_messages : DataMessagesType[],
    newData_messages : NewDataMessagesType[]
}
type DialogsType = {
    image : string
    name : string
    id : string
}
type DataMessagesType= {
    message : string
    answer : string
}
type NewDataMessagesType = {
    message : string
    answer : string
}
 const initialState: DialogsInitialStateType = {
    dialogs_data: [
        {"image": "https://img.freepik.com/free-icon/user_318-159711.jpg", "name": "Dimon", "id": "1"},
        {"image": "https://img.freepik.com/free-icon/user_318-159711.jpg", "name": "Vasya", "id": "2"},
        {"image": "https://img.freepik.com/free-icon/user_318-159711.jpg", "name": "Fara", "id": "3"},
        {"image": "https://img.freepik.com/free-icon/user_318-159711.jpg", "name": "Mara", "id": "4"},
        {"image": "https://img.freepik.com/free-icon/user_318-159711.jpg", "name": "Viktor", "id": "5"},
        {"image": "https://img.freepik.com/free-icon/user_318-159711.jpg", "name": "Valeriya", "id": "6"}
    ],
    data_messages: [
        {"message": "hi", "answer": "my name"},
        {"message": "hello", "answer": "my surname"},
        {"message": "hey", "answer": "my azziz"},
    ],
    newData_messages : [
        {"message" : "one","answer" : "one"}
    ]
}

export const DialogsReducer = (state = initialState, action: ActionsTypes): DialogsInitialStateType => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            let body = action.value
            return{
                ...state,
                data_messages: [...state.data_messages, {message: body ,  answer: "random"}]
            }
        default:
            return state;
    }
};

// export const addMessageAction = (value : string): AddMessageReduxAT => {
//     return {
//         type: ADD_MESSAGE,
//         value : value
//     }
// }




type ActionsTypes = InferActionsTypes<typeof actions>
type ThunkType = ThunkAction<Promise<void>, AuthState, unknown, ActionsTypes >


export const actions = {
   addMessageAction : (value : string) => ({type: 'ADD_MESSAGE', value : value } as const)
}


export default DialogsReducer


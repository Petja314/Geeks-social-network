import React from 'react';
import {InferActionsTypes} from "./Redux-Store";
import {dialogsAPI} from "../../api/DialogsAPI";
import {ResultCodesEnum} from "../../api/Api";

// export type DialogsInitialStateType = {
//     data_messages : [
//         {sent_message : any , user_answer: any}
//     ]
// }

const initialState: any = {
    // data_messages : [
    //     {sent_message : '' , user_answer: ''}
    // ],
    message_sent : '',
    data_messages : []
}

export const DialogsReducer = (state = initialState, action: ActionsTypes): any => {
    switch (action.type) {
        case 'SEND_MESSAGE':
            return {
                ...state,
                message_sent : action.message,
                // data_messages : [...state.data_messages, {sent_message : action.message} ]
            }
        case 'LIST_OF_MESSAGES' :
                return {
                ...state,
                    data_messages: action.messages_list
                }
        default:
            return state;
    }
};


type ActionsTypes = InferActionsTypes<typeof actionsDialogs>

export const actionsDialogs = {
     addMessageAction : (message : any) => ({
        type: "SEND_MESSAGE",
         message
    } as const) ,
    listOfdMessageAction : (messages_list : any) => ({
        type: "LIST_OF_MESSAGES",
        messages_list
    } as const)
}


export const getAllDialogsThunk  = (): any => async (dispatch: any) => {
    const response = await dialogsAPI.getAllDialogs();
    if (response.data.resultCode === ResultCodesEnum.Success) {
    }
    // console.log(response)
}
export const sendMessageToFriendThunk = (message: any, userId: any): any => async (dispatch: any) => {
    const response = await dialogsAPI.sendMessageToFriend(userId, message);
    if (response.data.resultCode === ResultCodesEnum.Success) {
        dispatch(actionsDialogs.addMessageAction(response.data.data.message.body))
    }
}

export const listOfMessagesThunk = (userId : any , currentPage  : any, pageSize : any): any => async (dispatch: any) => {
    const response = await dialogsAPI.getListOfMessages(userId,currentPage,pageSize );
    if (response.status === 200) {
        // debugger
            dispatch(actionsDialogs.listOfdMessageAction(response.data.items))
    }
    // console.log(response.data.items)
}


export const startChattingThunk = (userId : any) => async (dispatch : any) => {
    const response = await dialogsAPI.startChattingDialogs(userId)
    console.log('response' , response)
}


export const listOfNewMessagesThunk = () => async (dispatch : any) => {
    let response =  dialogsAPI.listOfNewMessages()
    console.log('list of new messages response : ' , response)
}


export default DialogsReducer


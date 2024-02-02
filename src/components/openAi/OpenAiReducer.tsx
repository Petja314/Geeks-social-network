import React from 'react';
import {openAiCall} from "./OpenApi";
import {InferActionsTypes, RootState} from "../redux/Redux-Store";
import {ThunkAction} from "redux-thunk";
import {message} from "antd";
import {ActionsProfileTypes} from "../redux/ProfileReducer";

export type MessagesResponseAiType = {
    role : string
    content : string
}

export type OpenAiTypes = {
    userInput: string,
    chatBotResponse: any
    messages: MessagesResponseAiType[]

}
const initialState = {
    userInput: '',
    chatBotResponse: '',
    messages: []
}

const OpenAiReducer = (state = initialState, action: ActionsTypeOpenAi): OpenAiTypes => {
    switch (action.type) {
        case "MESSAGE_RECEIVED_AI" :
            return {
                ...state,
                messages :  [...state.messages,  {role : action.role, content: action.message }]
            }
        case "INPUT_VALUE" :
            return {
                ...state,
                userInput: action.value
            }
        case "CLEAR_MESSAGES":
            return {
                ...state,
                messages: []
            };
        default :
            return state
    }
};


type ActionsTypeOpenAi = InferActionsTypes<typeof OpenAiAction>
export const OpenAiAction = {
    messageReceivedAiAC: (role : any, message: string) => ({
        type: "MESSAGE_RECEIVED_AI",
        role,
        message
    } as const),
    inputValueSentAC: (value: string) => ({
        type: "INPUT_VALUE",
        value
    } as const),
    clearMessagesAC: () => ({
        type: "CLEAR_MESSAGES"
    } as const)

}
type ThunkTypeForBothReducers = ThunkAction<Promise<void>, RootState, unknown, ActionsTypeOpenAi | any>;
export const postMessageToAiThunk = (role : string, userInput: string) : ThunkTypeForBothReducers => async (dispatch  , getState ) => {
    //Dispatch the message from user side
    dispatch(OpenAiAction.messageReceivedAiAC(role, userInput))
    try {
        const {messages} = getState().openAiPage
        const response = await openAiCall.AiPost(messages)
        if ( response.status === 200 ) {
            let response_data = response.data.choices[0].message
            dispatch(OpenAiAction.messageReceivedAiAC(response_data.role, response_data.content))
        }
        console.log('response failed!')
    }
    catch (error) {
        console.log(error , 'error')
    }
}
export default OpenAiReducer;
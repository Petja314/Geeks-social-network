import React from 'react';
import {InferActionsTypes} from "./Redux-Store";
import {chatAPI, ChatMessageType, StatusType} from "../../api/ChatApi";
import {message} from "antd";
import {Dispatch} from "redux";
import {Status} from "filepond";

type AuthState = {
    messages: any,
    status : string

}
// type StatusType = 'pending' | 'ready'
const initialState: AuthState = {
    messages: [] as ChatMessageType[],
    status : 'pending' as StatusType
}


export const ChatReducer = (state = initialState, action: ActionsTypes): AuthState => {
    switch (action.type) {
        case 'MESSAGES_RECEIVED' :
            return {
                ...state,
                messages: [...state.messages, ...action.payload.messages]
            }
        case 'STATUS_CHANGED' :
            return {
                ...state,
                status : action.payload.status
            }

        default:
            return state;
    }
};


//ACTION CREATORS - AC
type ActionsTypes = InferActionsTypes<typeof actions>

export const actions = {
    messagesReceived: (messages: ChatMessageType[]) => ({
        type: 'MESSAGES_RECEIVED',
        payload: {messages}
    } as const),
    statusChanged: (status: StatusType) => ({
        type: 'STATUS_CHANGED',
        payload: {status}
    } as const),
}

let _newMessageHandler: ((messages: ChatMessageType[]) => void) | null = null
const newMessageHandlerCreator = (dispatch: Dispatch) => {
    if (_newMessageHandler === null) {
        _newMessageHandler = (messages) => {
            dispatch(actions.messagesReceived(messages))
        }
    }
    return _newMessageHandler
}

let _statusChangedHandler: ((status: StatusType) => void) | null = null
const statusChangedHandlerCreator = (dispatch: Dispatch) => {
    if (_statusChangedHandler === null) {
        _statusChangedHandler = (status) => {
            dispatch(actions.statusChanged(status))
        }
    }
    return _statusChangedHandler
}

export const startMessagesListeningThunk = (): any => async (dispatch: any) => {
    chatAPI.start()
    chatAPI.subscribe('messages-received' , newMessageHandlerCreator(dispatch))
    chatAPI.subscribe('status-changed' , statusChangedHandlerCreator(dispatch))
}

export const stopMessagesListeningThunk = (): any => async (dispatch: any) => {
    chatAPI.unsubscribe('messages-received',newMessageHandlerCreator(dispatch))
    chatAPI.unsubscribe('status-changed',statusChangedHandlerCreator(dispatch))
    chatAPI.stop()
}

export const sendMessageThunk = (message : string): any => async (dispatch: any) => {
    chatAPI.sendMessage(message)
}

export default ChatReducer


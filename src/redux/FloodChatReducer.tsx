import {DemoChatApi, MessageInfoType} from "../api/FloodChatApi";
import {Dispatch} from "redux";
import {InferActionsTypes} from "./Redux-Store";

export  type WebSocketStateType = {
    messages : MessageInfoType[]
}

const initialState : WebSocketStateType   = {
    messages : []
}
export const FloodChatReducer = (state : WebSocketStateType  = initialState , action : ActionsType ) => {
    switch (action.type){
        case  "MESSAGES_RECEIVED" :
            return {
                ...state,
                messages: [...state.messages, ...action.payload.messages]
            }
        default :
            return state
    }
}

type ActionsType = InferActionsTypes<typeof ChatActions>
export const ChatActions = {
    messagesReceivedAC : (messages : MessageInfoType[]) => ({
        type : "MESSAGES_RECEIVED",
        payload: {messages}
    }as const),
}


let _newMessageHandler: ((messages: any) => void) | null = null
const newMessageHandlerCreator = (dispatch: Dispatch) => {
    if (_newMessageHandler === null) {
        _newMessageHandler = (messages) => {
            dispatch(ChatActions.messagesReceivedAC(messages))
        }
    }
    return _newMessageHandler
}
export const startMessagesListening = () => (dispatch : Dispatch) => {
    DemoChatApi.start_websocket()
    DemoChatApi.subscribe(newMessageHandlerCreator(dispatch))
}
export const stopMessagesListening = () => (dispatch : Dispatch) => {
    DemoChatApi.unsubscribe(newMessageHandlerCreator(dispatch))
    DemoChatApi.stop()
}
export const sendMessageThunk = (messages : string) => () => {
    DemoChatApi.send_message(messages)
}



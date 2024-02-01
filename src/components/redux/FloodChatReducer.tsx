import {DemoChatApi, MessageInfoType} from "../../api/FloodChatApi";
import {Dispatch} from "redux";

export  type WebSocketStateType = {
    messages : MessageInfoType[]
}

const initialState : WebSocketStateType   = {
    messages : []
}
export const FloodChatReducer = (state  = initialState , action : any ) => {
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


export const ChatActions = {
    messagesReceivedAC : (messages : MessageInfoType) => ({
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
export const startMessagesListening = () => (dispatch : any) => {
    DemoChatApi.start_websocket()
    DemoChatApi.subscribe(newMessageHandlerCreator(dispatch))
}
export const stopMessagesListening = () => (dispatch : any) => {
    DemoChatApi.unsubscribe(newMessageHandlerCreator(dispatch))
    DemoChatApi.stop()
}
export const sendMessageThunk = (messages : string) => () => {
    // console.log('messages' , messages)
    DemoChatApi.send_message(messages)
}



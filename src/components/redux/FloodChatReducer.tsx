import {DemoChatApi, MessageInfoType} from "../../api/FloodChatApi";

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

export const startMessagesListening = () => (dispatch : any) => {
    DemoChatApi.start_websocket()
    DemoChatApi.subscribe((messages : MessageInfoType) => {
        // debugger
        dispatch(ChatActions.messagesReceivedAC(messages))
    })
}
export const stopMessagesListening = () => (dispatch : any) => {
    DemoChatApi.start_websocket()
    DemoChatApi.unsubscribe((messages : MessageInfoType) => {
        dispatch(ChatActions.messagesReceivedAC(messages))
    })
}
export const sendMessageThunk = (messages : string) => () => {
    DemoChatApi.send_message(messages)
}



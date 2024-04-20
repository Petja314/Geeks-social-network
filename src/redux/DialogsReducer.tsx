import React from 'react';
import {InferActionsTypes, RootState} from "./Redux-Store";
import {dialogsAPI} from "../api/DialogsAPI";
import {ThunkAction} from "redux-thunk";

export type DialogsStateTypes = {
    // DIALOGS STATE
    dialogs: DialogsArrayType[],
    newMessageCount: number, //store the new message count from API //newMessageReceived.get
    prevNewMessageValue: number,
    currentDialogsPage: number,
    pageSizeDialogs: number,

// MESSENGER CHAT
    currentPageChat: number,
    pageSize: number,
    pagesTotalCount: null,
    selectedUser: {
        selectedUserName: string,
        photo: null | string
    },
    friendIdLocal: null,
    messages: DialogsMessagesArrayType[],
    message: string,
    fetchingPage: boolean,
    filter: {
        term: string,
        friend: null | boolean
    },
    messageId: string
}
export type DialogsArrayType = {
    "id": number,
    "userName": string,
    "hasNewMessages": boolean,
    "lastDialogActivityDate": string,
    "lastUserActivityDate": string,
    "newMessagesCount": number,
    "photos": {
        "small": null,
        "large": null
    }
}
export type DialogsMessagesArrayType = {
    "id": string,
    "body": string,
    "translatedBody": null,
    "addedAt": string,
    "senderId": number,
    "senderName": string,
    "recipientId": number,
    "viewed": boolean
}


const initialState: DialogsStateTypes = {
    // DIALOGS STATE
    dialogs: [],
    newMessageCount: 0, //store the new message count from API //newMessageReceived.get
    prevNewMessageValue: 0,
    currentDialogsPage: 1,
    pageSizeDialogs: 10, //5

// MESSENGER CHAT
    currentPageChat: 1,
    pageSize: 5,
    pagesTotalCount: null,
    selectedUser: {
        selectedUserName: '',
        photo: null as null | ''
    },
    friendIdLocal: null as null,
    messages: [],
    message: '',
    fetchingPage: false,
    filter: {
        term: "",
        friend: null as null | boolean
    },
    messageId: ""
}

export const DialogsReducer = (state = initialState, action: ActionsTypesDialogs): DialogsStateTypes => {
    switch (action.type) {
        case 'SET_ALL_DIALOGS':
            return {
                ...state,
                dialogs: action.dialogs //setting all dialogs from api
            }
        case 'NEW_MESSAGE_RECEIVED' :
            return {
                ...state,
                newMessageCount: action.newMessageCount
            }
        case 'SET_CURRENT_PAGE' :
            return {
                ...state,
                currentPageChat: action.currentPageChat
            }
        case 'SET_SELECTED_USER_NAME' :
            return {
                ...state,
                // selectedUserName: action.userName
                selectedUser: {selectedUserName: action.userName, photo: action.photoUser}
            }
        case 'SET_FRIEND_ID' :
            return {
                ...state,
                friendIdLocal: action.friendId
            } as DialogsStateTypes

        case 'SET_MESSAGES' :
            return {
                ...state,
                messages: action.messages
            }
        case 'SET_PAGES_TOTAL_COUNT' :
            return {
                ...state,
                pagesTotalCount: action.pagesTotalCount
            }
        case 'SET_CURRENT_DIALOGS_PAGE' :
            return {
                ...state,
                currentDialogsPage: action.pageNumber
            }
        case 'SET_MESSAGE_ID' :
            return {
                ...state,
                messageId: action.messageId
            }
        default:
            return state;
    }
};


type ActionsTypesDialogs = InferActionsTypes<typeof actionsDialogs>

export const actionsDialogs = {
    setAllDialogsAction: (dialogs: DialogsArrayType[]) => ({
        type: "SET_ALL_DIALOGS",
        dialogs
    } as const),
    setNewMessageCountAction: (newMessageCount: number) => ({
        type: "NEW_MESSAGE_RECEIVED",
        newMessageCount
    } as const),
    setCurrentPageAction: (currentPageChat: number) => ({
        type: "SET_CURRENT_PAGE",
        currentPageChat
    } as const),
    setSelectedUserNameAction: (userName: string, photoUser: string | null) => ({
        type: "SET_SELECTED_USER_NAME",
        userName,
        photoUser
    } as const),
    setFriendIdLocalAction: (friendId: number | null) => ({
        type: "SET_FRIEND_ID",
        friendId
    } as const),
    setMessagesAction: (messages: DialogsMessagesArrayType[]) => ({
        type: "SET_MESSAGES",
        messages
    } as const),
    setPagesTotalCount: (pagesTotalCount: null) => ({
        type: "SET_PAGES_TOTAL_COUNT",
        pagesTotalCount
    } as const),
    setCurrentDialogsPageAction: (pageNumber: number) => ({
        type: "SET_CURRENT_DIALOGS_PAGE",
        pageNumber
    } as const),
    setMessageIdAction: (messageId: string) => ({
        type: "SET_MESSAGE_ID",
        messageId
    } as const)
}

type ThunkType = ThunkAction<Promise<void>, DialogsStateTypes, unknown, ActionsTypesDialogs | any>
type ThunkTypeForBothReducers = ThunkAction<Promise<void>, RootState, unknown, ActionsTypesDialogs | any>;

const getChatPageInfo = (getState: () => RootState) => {
    const currentPageChat = getState().messagesPage.currentPageChat
    const pageSize = getState().messagesPage.pageSize
    const friendIdLocal = getState().messagesPage.friendIdLocal
    return {currentPageChat, pageSize, friendIdLocal}
}

export const fetchDialogsThunk = (): ThunkType => async (dispatch) => {
    const response = await dialogsAPI.fetchDialogs()
    if (response.status === 200) {
        dispatch(actionsDialogs.setAllDialogsAction(response.data))
    }
}
export const newMessageReceivedThunk = (): ThunkType => async (dispatch) => {
    const response = await dialogsAPI.newMessageReceived()
    if (response.status === 200) {
        dispatch(actionsDialogs.setNewMessageCountAction(response.data))
    }
}

export const startChatThunk = (friendId: number | null, userName: string, photoUser: string | null): ThunkTypeForBothReducers => async (dispatch, getState) => {
    const {currentPageChat, pageSize} = getChatPageInfo(getState)
    dispatch(actionsDialogs.setCurrentPageAction(1))
    dispatch(actionsDialogs.setSelectedUserNameAction(userName, photoUser))
    dispatch(actionsDialogs.setFriendIdLocalAction(friendId))
    await dialogsAPI.startChat(friendId)
    dispatch(refreshMessagesThunk(friendId, currentPageChat, pageSize))
}

export const sendMessageThunk = (friendIdLocal: null, message: string): ThunkTypeForBothReducers => async (dispatch, getState) => {
    const {currentPageChat, pageSize, friendIdLocal} = getChatPageInfo(getState)
    await dialogsAPI.sendMessage(friendIdLocal, message)
    dispatch(refreshMessagesThunk(friendIdLocal, currentPageChat, pageSize))
}

export const refreshMessagesThunk = (friendId: number | null, currentPageChat: number, pageSize: number): ThunkType => async (dispatch) => {
    if (friendId) {
        const response = await dialogsAPI.refreshMessages(friendId, currentPageChat, pageSize)
        dispatch(actionsDialogs.setMessagesAction(response.data.items))
        dispatch(actionsDialogs.setPagesTotalCount(response.data.totalCount))
    }
}
export const deleteMessageThunk = (messageId: string): ThunkTypeForBothReducers => async (dispatch, getState) => {
    const {currentPageChat, pageSize, friendIdLocal} = getChatPageInfo(getState)
    dispatch(actionsDialogs.setMessageIdAction(messageId))
    await dialogsAPI.deleteMessage(messageId)
    dispatch(refreshMessagesThunk(friendIdLocal, currentPageChat, pageSize))
}
export const restoreMessageThunk = (messageId: string): ThunkTypeForBothReducers => async (dispatch,getState ) => {
    const {currentPageChat, pageSize, friendIdLocal} = getChatPageInfo(getState)
    if (messageId) {
        await dialogsAPI.restoreMessage(messageId)
        dispatch(refreshMessagesThunk(friendIdLocal, currentPageChat, pageSize))
    }
}


export default DialogsReducer


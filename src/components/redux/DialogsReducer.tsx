import React, {useState} from 'react';
import {InferActionsTypes} from "./Redux-Store";
import {dialogsAPI} from "../../api/DialogsAPI";
import {instance, ResultCodesEnum} from "../../api/Api";
import {act} from "react-dom/test-utils";
// lastPageChat = Math.ceil(pagesTotalCount / pageSize


const initialState: any = {
    // DIALOGS STATE
    dialogs: [],
    newMessageCount: 0, //store the new message count from API //newMessageReceived.get
    prevNewMessageValue: 0,
    currentDialogsPage: 1,
    pageSizeDialogs: 5,

// MESSENGER CHAT
    currentPage: 1,
    pageSize: 5,
    pagesTotalCount: null,
    selectedUserName: '',
    friendIdLocal: null,
    messages: [],
    message: '',
    fetchingPage: false,
    filter: {
        term: "",
        friend: null as null | boolean
    },
}

export const DialogsReducer = (state = initialState, action: ActionsTypes): any => {
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
                currentPage: action.currentPage
            }
        case 'SET_SELECTED_USER_NAME' :
            return {
                ...state,
                selectedUserName: action.userName
            }
        case 'SET_FRIEND_ID' :
            return {
                ...state,
                friendIdLocal: action.friendId
            }
        case 'SET_MESSAGE_LOCAL_INPUT' :
            return {
                ...state,
                message: action.message //empty input from chat
            }
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
            case 'FIND_DIALOG' :
            return {
                ...state,

            }


        default:
            return state;
    }
};


type ActionsTypes = InferActionsTypes<typeof actionsDialogs>

export const actionsDialogs = {
    setAllDialogsAction: (dialogs: any) => ({
        type: "SET_ALL_DIALOGS",
        dialogs
    } as const),
    setNewMessageCountAction: (newMessageCount: any) => ({
        type: "NEW_MESSAGE_RECEIVED",
        newMessageCount
    } as const),
    setCurrentPageAction: (currentPage: number) => ({
        type: "SET_CURRENT_PAGE",
        currentPage
    } as const),
    setSelectedUserNameAction: (userName: any) => ({
        type: "SET_SELECTED_USER_NAME",
        userName
    } as const),
    setFriendIdLocalAction: (friendId: any) => ({
        type: "SET_FRIEND_ID",
        friendId
    } as const),
    setMessageLocalAction: (message: any) => ({
        type: "SET_MESSAGE_LOCAL_INPUT",
        message
    } as const),
    setMessagesAction: (messages: any) => ({
        type: "SET_MESSAGES",
        messages
    } as const),
    setPagesTotalCount: (pagesTotalCount: any) => ({
        type: "SET_PAGES_TOTAL_COUNT",
        pagesTotalCount
    } as const),
    setCurrentDialogsPageAction: (pageNumber: any) => ({
        type: "SET_CURRENT_DIALOGS_PAGE",
        pageNumber
    } as const),
    findDialogAction: (filter: any) => ({
        type: "FIND_DIALOG",
        filter
    } as const),


}

// dialogsAPI
// actionsDialogs
export const fetchDialogsThunk = (): any => async (dispatch: any) => {
    const response = await dialogsAPI.fetchDialogs()
    if (response.status === 200) {
        dispatch(actionsDialogs.setAllDialogsAction(response.data))
    }
}
export const newMessageReceivedThunk = (): any => async (dispatch: any) => {
    const response = await dialogsAPI.newMessageReceived()
    if (response.status === 200) {
        dispatch(actionsDialogs.setNewMessageCountAction(response.data))
    }
}

export const startChatThunk = (friendId: any, userName: any): any => async (dispatch: any, getState: any) => {
    // debugger
    const currentPage = getState().messagesPage.currentPage // ??
    const pageSize = getState().messagesPage.pageSize // ??


    dispatch(actionsDialogs.setCurrentPageAction(1))
    dispatch(actionsDialogs.setSelectedUserNameAction(userName))
    dispatch(actionsDialogs.setFriendIdLocalAction(friendId))
    await dialogsAPI.startChat(friendId)
    dispatch(refreshMessagesThunk(friendId, currentPage, pageSize))
    // await instance.put(`dialogs/${friendId}`)
    // await refreshMessages(friendId);
}

export const sendMessageThunk = (friendIdLocal: any, message: any): any => async (dispatch: any, getState: any) => {
    const currentPage = getState().messagesPage.currentPage // ??
    const pageSize = getState().messagesPage.pageSize // ??

    const friendIdLocal = getState().messagesPage.friendIdLocal
    await dialogsAPI.sendMessage(friendIdLocal, message)
    // dispatch(actionsDialogs.setMessageLocalAction(message))
    dispatch(refreshMessagesThunk(friendIdLocal, currentPage, pageSize))
    // await refreshMessages(friendIdLocal);
}

export const refreshMessagesThunk = (friendId: any, currentPage: any, pageSize: any): any => async (dispatch: any, getState: any) => {
    if (friendId) {
        // console.log('refreshing new messages...')
        const response = await dialogsAPI.refreshMessages(friendId, currentPage, pageSize)
        dispatch(actionsDialogs.setMessagesAction(response.data.items))
        dispatch(actionsDialogs.setPagesTotalCount(response.data.totalCount))
    }

}


export default DialogsReducer


import {instance} from "./Api";
import {DialogsArrayType} from "../redux/DialogsReducer";


export const dialogsAPI = {
    fetchDialogs(): Promise<DialogsApiResponse> {
        return instance.get <DialogsArrayType[]>('dialogs')
    },
    newMessageReceived(): Promise<DialogsMessageReceivedType> {
        return instance.get<number>('dialogs/messages/new/count')
    },
    startChat(friendId: number | null) {
        return instance.put<number | null>(`dialogs/${friendId}`)
    },
    sendMessage(friendIdLocal: null, message: string) {
        return instance.post<ResponseType>(`dialogs/${friendIdLocal}/messages`, {body: message})
    },
    refreshMessages(friendId: number | null, currentPage: number, pageSize: number) {
        return instance.get<refreshMessagesType>(`dialogs/${friendId}/messages?page=${currentPage}&count=${pageSize}`)

    },
    deleteMessage(messageId: string) {
        return instance.delete<ResponseType>(`dialogs/messages/${messageId}`)
    },
    restoreMessage(messageId: string) {
        return instance.put<ResponseType>(`dialogs/messages/${messageId}/restore`)
    }
}

export type DialogsApiResponse = {
    data: DialogsArrayType[];
    status: number
};
type DialogsMessageReceivedType = {
    data: number,
    status: number
}
type refreshMessagesType = {
    items: [],
    totalCount: null,
    error: null
}

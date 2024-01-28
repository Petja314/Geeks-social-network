import {instance} from "./Api";
import {refreshMessagesThunk} from "../components/redux/DialogsReducer";


export const dialogsAPI = {
    fetchDialogs() {
        return instance.get('dialogs')
    },
    newMessageReceived() {
        return instance.get('dialogs/messages/new/count')
    },
    startChat(friendId : any) {
        return instance.put(`dialogs/${friendId}`)
    },
    sendMessage(friendIdLocal : any ,message : any ) {
        return instance.post(`dialogs/${friendIdLocal}/messages`, {body: message})
    },
    refreshMessages(friendId : any ,currentPage : any ,pageSize : any  ) {
       return instance.get(`dialogs/${friendId}/messages?page=${currentPage}&count=${pageSize}`)

    },
    deleteMessage(messageId : string) {
        return instance.delete(`dialogs/messages/${messageId}`)
    },
    restoreMessage(messageId : string) {
        return instance.put(`dialogs/messages/${messageId}/restore`)
    }
}
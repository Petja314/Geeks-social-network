import {instance} from "./Api";


export const dialogsAPI = {
    startChattingDialogs(userId : any ) {
        return instance.put(`dialogs/${userId}`)
    },
    getAllDialogs() {
        return instance.get('dialogs')
    },
    getListOfMessages(userId : any , currentPage : any , pageSize : any) {
        return instance.get(`dialogs/${userId}/messages?page=${currentPage}&count=${pageSize}`)
    },//!!!URI Parameters for getListOfMessages :
// userId - (number) - user id of your friend
// page (number,default 1) number of requested portion
// count (number, default 10) size of requestedPortion

sendMessageToFriend(userId : any, messages : any) {
        return instance.post(`dialogs/${userId}/messages`, {body : messages})
    },
    deleteMessageForYou(messageId : any) {
        return instance.delete(`dialogs/messages/${messageId}`)
    },
    listOfNewMessages() {
        return instance.get('dialogs/messages/new/count')
    }

}
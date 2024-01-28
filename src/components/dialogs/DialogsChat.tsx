import React, {UIEventHandler, useEffect, useRef, useState} from 'react';
import UserAvatarPhoto from "../users/UserAvatarPhoto";
import {actionsDialogs, deleteMessageThunk, DialogsMessagesArrayType, DialogsStateTypes, refreshMessagesThunk, restoreMessageThunk, sendMessageThunk} from "../redux/DialogsReducer";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../redux/Redux-Store";
import {dialogsAPI} from "../../api/DialogsAPI";
import {act} from "react-dom/test-utils";

export type DialogsChatPropsType = {
    friendIdLocal: null | any; // Adjust the type accordingly
    currentPageChat: number;
    pageSize: number;
    pagesTotalCount: null | any; // Adjust the type accordingly
    selectedUser: {
        selectedUserName: string;
        photo: null | string;
    };
    messages: DialogsMessagesArrayType[];
};

const DialogsChat: React.FC<DialogsChatPropsType> = ({friendIdLocal, currentPageChat, pageSize, pagesTotalCount, selectedUser, messages,}) => {

    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const scrollContainerRef = useRef<HTMLInputElement>(null);
    const messageRef:React.MutableRefObject<any> = useRef<string>('')
    const [fetchingPage, setFetchingPage] = useState<boolean>(false)
    const lastPageChat   = Math.ceil(pagesTotalCount  / pageSize)
    const authorizedUserId: number | null = useSelector((state: RootState) => state.userAuthPage.userId)
    const messageId = useSelector((state : any) => state.messagesPage.messageId)
    const [activeBtn, setActiveBtn] = useState(false)

    // console.log('messageId' , messageId)

    //SCROLL AT THE BOTTOM BY DEFAULT
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages])

    // UIEventHandler<HTMLDivElement>
    const scrollHandlerMessages = (event:  React.UIEvent<HTMLDivElement>  ) => {
        const element  = event.currentTarget  as HTMLDivElement;
        //UP ++
        if (element.scrollTop === 0 && currentPageChat && currentPageChat !== lastPageChat) { // top of the page
            element.scrollTop = 20
            setFetchingPage(true)
            dispatch(actionsDialogs.setCurrentPageAction(currentPageChat + 1))
        }
        //DOWN --
        if (element.scrollHeight - (element.scrollTop + element.clientHeight) < 1 && currentPageChat !== 1) { //bottom of the page
            element.scrollTop = 80
            setFetchingPage(true)
            dispatch(actionsDialogs.setCurrentPageAction(currentPageChat - 1))
        }
    }
    const sendMessage =  () => {
        if (messageRef.current) {
            dispatch(sendMessageThunk(friendIdLocal, messageRef.current.value))
            messageRef.current.value = ""
            setActiveBtn(false)
        }

    };
    const handleInputChange = () => {
        setActiveBtn(messageRef.current.value.trim() !== "")
    }

    return (
        <div>
            {/*CHAT SECTION*/}
            <div style={{position: "relative"}}>
                {/*<div>current page chat : {currentPageChat}</div>*/}
                <div
                    ref={scrollContainerRef}
                    onScroll={scrollHandlerMessages}
                    style={{border: "1px solid black", height: "350px", width: "500px", overflowY: "auto"}}>

                    <div className="sticky">
                        <div>{selectedUser.selectedUserName}</div>
                        <div style={{maxWidth: "200px"}}><UserAvatarPhoto photos={selectedUser.photo}/></div>
                    </div>
                    <div style={{paddingLeft: "30px"}}>
                        {messages.map((message: any) => (

                             <div className={authorizedUserId === message.senderId ? "dialogs_right" : "dialogs_left"} >
                                User: {message.senderName}
                                <div
                                    style={{paddingTop: "10px"}}>Message : {message.body}
                                    <button onClick={()  => {dispatch(deleteMessageThunk(message.id)) }}>delete</button>
                                </div>
                                <hr style={{marginTop: "10px"}}/>
                            </div>

                        ))}
                    </div>
                </div>


                {/*CHAT INNER SECTION*/}
                <div style={{border: "1px solid black", padding: "20px", width: "500px", height: "150px"}}>
                    <div>
                        <input placeholder="Select user to chat!"
                               style={{width: "100%", height: "50px"}} type="text"
                               disabled={!friendIdLocal}
                               onChange={handleInputChange}
                               ref={messageRef}
                        />
                    </div>
                    {/*DISABLE BUTTON IF FRIEND IS NOT SELECTED*/}
                    <div style={{marginTop: "10px"}}>
                        <button disabled={!friendIdLocal ||!activeBtn } onClick={sendMessage}>Send Message</button>
                        <button onClick={ () => {dispatch(restoreMessageThunk(messageId)) }} > restore last message </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DialogsChat;
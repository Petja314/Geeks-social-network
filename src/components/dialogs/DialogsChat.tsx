import React, {KeyboardEvent, UIEventHandler, useEffect, useRef, useState} from 'react';
import UserAvatarPhoto from "../users/UserAvatarPhoto";
import {actionsDialogs, deleteMessageThunk, DialogsMessagesArrayType, DialogsStateTypes, refreshMessagesThunk, restoreMessageThunk, sendMessageThunk} from "../../redux/DialogsReducer";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import InfiniteScroll from "react-infinite-scroll-component";
import recylceBin from "../../assets/images/icons/bin.jpeg"
import "../../css/dialogs messenger/dialogs.css"
import sendBtn from "../../assets/images/icons/send.png";


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
    const messageRef: React.MutableRefObject<any> = useRef<string>('')
    const lastPageChat = Math.ceil(pagesTotalCount / pageSize)
    const authorizedUserId: number | null = useSelector((state: RootState) => state.userAuthPage.userId)
    const messageId: string = useSelector((state: RootState) => state.messagesPage.messageId)
    const [activeBtn, setActiveBtn] = useState<boolean>(false)

    //SCROLL AT THE BOTTOM BY DEFAULT
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages])

    const scrollHandlerMessages = (event: React.UIEvent<HTMLDivElement>) => {
        const element = event.currentTarget as HTMLDivElement;
        //UP ++
        if (element.scrollTop === 0 && currentPageChat && currentPageChat !== lastPageChat) { // top of the page
            element.scrollTop = 20
            dispatch(actionsDialogs.setCurrentPageAction(currentPageChat + 1))
        }
        //DOWN --
        if (element.scrollHeight - (element.scrollTop + element.clientHeight) < 1 && currentPageChat !== 1) { //bottom of the page
            element.scrollTop = 80
            dispatch(actionsDialogs.setCurrentPageAction(currentPageChat - 1))
        }
    }
    const sendMessage = () => {
        if (messageRef.current) {
            dispatch(sendMessageThunk(friendIdLocal, messageRef.current.value))
            messageRef.current.value = ""
            setActiveBtn(false)
        }

    };

    const handleInputChange = () => {
        setActiveBtn(messageRef.current.value.trim() !== "")
    }
    const handleKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            sendMessage()
        }
    }

    return (
        <div className="chat_container">

                {/*CHAT SECTION*/}
                {/*<div>current page flood_chat : {currentPageChat}</div>*/}
                <div
                    className="chat_section"
                    ref={scrollContainerRef}
                    onScroll={scrollHandlerMessages}
                    style={{overflowY: "auto"}}>

                    <div className="sticky">
                        <div className="selected_user_title" >{selectedUser.selectedUserName}</div>
                        <div><UserAvatarPhoto photos={selectedUser.photo}/></div>
                    </div>
                    <div>
                        {messages.map((message: DialogsMessagesArrayType) => (
                            <div key={message.id} className={authorizedUserId === message.senderId ? "dialogs_right" : "dialogs_left"}>
                                User: {message.senderName}
                                <div className="message_section">Message : {message.body}
                                    <button onClick={() => {
                                        dispatch(deleteMessageThunk(message.id))
                                    }}>
                                        <img src={recylceBin} alt=""/>
                                        {/*delete*/}
                                    </button>
                                </div>
                                <hr className="underline"/>
                            </div>

                        ))}
                    </div>

                </div>

                {/*CHAT INNER SECTION*/}
                <div className="chat_inner_section">
                    <div className="input-container">

                        <textarea
                            onKeyDown={handleKeyDown}
                            placeholder="Select user to chat!"
                            disabled={!friendIdLocal}
                            onChange={handleInputChange}
                            ref={messageRef}
                        />
                        {/*DISABLE BUTTON IF FRIEND IS NOT SELECTED*/}
                        <div className="send_message_btn">
                            <button disabled={!friendIdLocal || !activeBtn} onClick={sendMessage}>
                                {/*Send Message*/}
                                <img src={sendBtn} alt=""/>
                            </button>
                        </div>

                        <div className="restore_message_btn">
                            <button onClick={() => {
                                dispatch(restoreMessageThunk(messageId))
                            }}> undo
                            </button>
                        </div>
                    </div>
                </div>


        </div>
    );
};

const DialogsChatMemoComponent = React.memo(DialogsChat)
export default DialogsChatMemoComponent

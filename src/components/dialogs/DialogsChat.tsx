import React, { KeyboardEvent, UIEventHandler, useEffect, useRef, useState } from 'react';
import UserAvatarPhoto from "../users/users_avatars/UserAvatarPhoto";
import { actionsDialogs, deleteMessageThunk, DialogsMessagesArrayType, DialogsStateTypes, refreshMessagesThunk, restoreMessageThunk, sendMessageThunk } from "../../redux/DialogsReducer";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../../redux/Redux-Store";
import recycleBin from "../../assets/images/icons/bin.jpeg"
import "../../css/dialogs messenger/dialogs.css"
import sendBtn from "../../assets/images/icons/send.png";
import scrollDown from "../../assets/images/icons/scroll_down.png"

import checkInnerWidth from '../../common/helpers/checkInnerWidth';

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
    mob_toggleChat: Function
};

const DialogsChat: React.FC<DialogsChatPropsType> = ({ mob_toggleChat, friendIdLocal, currentPageChat, pageSize, pagesTotalCount, selectedUser, messages, }) => {

    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const scrollContainerRef = useRef<HTMLInputElement>(null);
    const messageRef: React.MutableRefObject<any> = useRef<string>('')
    const lastPageChat = Math.ceil(pagesTotalCount / pageSize)
    const authorizedUserId: number | null = useSelector((state: RootState) => state.userAuthPage.userId)
    const messageId: string = useSelector((state: RootState) => state.messagesPage.messageId)
    const [activeBtn, setActiveBtn] = useState<boolean>(false)

    const scrollHandlerMessages = (event: React.UIEvent<HTMLDivElement>) => {
        const element = event.currentTarget as HTMLDivElement;
        // console.log('element.scrollTop', element.scrollTop)
        //UP ++
        if (element.scrollTop === 0 && currentPageChat && currentPageChat !== lastPageChat) { // top of the page
            element.scrollTop = 20
            dispatch(actionsDialogs.setCurrentPageAction(currentPageChat + 1))
            dispatch(refreshMessagesThunk(friendIdLocal, currentPageChat + 1, pageSize))
        }
        //DOWN --
        if (element.scrollHeight - (element.scrollTop + element.clientHeight) < 1 && currentPageChat !== 1) { //bottom of the page
            element.scrollTop = 80
            dispatch(actionsDialogs.setCurrentPageAction(currentPageChat - 1))
            dispatch(refreshMessagesThunk(friendIdLocal, currentPageChat - 1, pageSize))

        }
    }
    const sendMessage = () => {
        if (messageRef.current) {
            dispatch(sendMessageThunk(friendIdLocal, messageRef.current.value.trim()))
            messageRef.current.value = ""
            setActiveBtn(false)
        }

    };

    const handleInputChange = () => {
        setActiveBtn(messageRef.current.value.trim() !== "")
    }
    const handleKeyDown = (event: any) => {
        if (event.keyCode === 13 && activeBtn) {
            sendMessage()
        }
    }

    //SCROLL AT THE BOTTOM BY DEFAULT
    const bottomChatHandler = () => {
        dispatch(actionsDialogs.setCurrentPageAction(1))
        dispatch(refreshMessagesThunk(friendIdLocal, 1, pageSize))
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
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
                style={{ overflowY: "auto" }}>

                <div className="sticky">
                    <div className="chat_section-top">
                        {
                            checkInnerWidth(850) ?
                                <button onClick={() => mob_toggleChat()} id='getToRecentDialogs'><img src="https://cdn-icons-png.flaticon.com/512/59/59121.png" alt="" /></button>
                                : ""
                        }
                        <div className="selected_user_title">{selectedUser.selectedUserName}</div>
                    </div>
                    <div className="dialogs_avatar"><UserAvatarPhoto photos={selectedUser.photo} /></div>
                </div>

                {messages.map((message: DialogsMessagesArrayType) => (
                    <div key={message.id} className={authorizedUserId === message.senderId ? "dialogs_right" : "dialogs_left"}>
                        User: {message.senderName}
                        <div className="message_section">
                            Message: {message.body}
                            <button onClick={() => {
                                dispatch(deleteMessageThunk(message.id))
                            }}>
                                <img className='deleteMessageIcon' src={recycleBin} alt="delete message" />
                                {/*delete*/}
                            </button>
                        </div>
                        <hr className="underline" />
                    </div>

                ))}
                <div>
                    {!friendIdLocal && <div className="select_user_to_chat">Select user to chat!</div>}
                </div>
            </div>

            {/*CHAT INNER SECTION*/}
            <div className="chat_inner_section">

                <div className="scroll_down_btn">
                    <button onClick={bottomChatHandler}>
                        <img src={scrollDown} alt="" />
                    </button>
                </div>

                <div className="input-container">

                    <textarea
                        onKeyDown={handleKeyDown}
                        disabled={!friendIdLocal}
                        onChange={handleInputChange}
                        ref={messageRef}
                    />

                    {/*DISABLE BUTTON IF FRIEND IS NOT SELECTED*/}

                    <div className="input-container-controls">
                        <div className="send_message_btn">
                            <button disabled={!friendIdLocal || !activeBtn} onClick={sendMessage}>
                                {/*Send Message*/}
                                <img src={sendBtn} alt="" />
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


        </div>
    );
};

const DialogsChatMemoComponent = React.memo(DialogsChat)
export default DialogsChatMemoComponent

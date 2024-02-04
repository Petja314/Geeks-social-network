import React, {KeyboardEvent, UIEventHandler, useEffect, useRef, useState} from 'react';
import UserAvatarPhoto from "../users/UserAvatarPhoto";
import {actionsDialogs, deleteMessageThunk, DialogsMessagesArrayType, DialogsStateTypes, refreshMessagesThunk, restoreMessageThunk, sendMessageThunk} from "../../redux/DialogsReducer";
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import InfiniteScroll from "react-infinite-scroll-component";

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
    const messageId : string = useSelector((state: RootState) => state.messagesPage.messageId)
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
        <div>

            {/*CHAT SECTION*/}
            <div style={{position: "relative"}}>
                {/*<div>current page flood_chat : {currentPageChat}</div>*/}
                <div
                    ref={scrollContainerRef}
                    onScroll={scrollHandlerMessages}
                    style={{border: "1px solid black", height: "350px", width: "500px", overflowY: "auto"}}>

                    <div className="sticky">
                        <div>{selectedUser.selectedUserName}</div>
                        <div style={{maxWidth: "200px"}}><UserAvatarPhoto photos={selectedUser.photo}/></div>
                    </div>
                    <div style={{paddingLeft: "30px"}}>
                        {messages.map((message: DialogsMessagesArrayType) => (

                            <div  key={message.id} className={authorizedUserId === message.senderId ? "dialogs_right" : "dialogs_left"}>
                                User: {message.senderName}
                                <div
                                    style={{paddingTop: "10px"}}>Message : {message.body}
                                    <button onClick={() => {
                                        dispatch(deleteMessageThunk(message.id))
                                    }}>delete
                                    </button>
                                </div>
                                <hr style={{marginTop: "10px"}}/>
                            </div>

                        ))}
                    </div>
                </div>


                {/*CHAT INNER SECTION*/}
                <div style={{border: "1px solid black", padding: "20px", width: "500px", height: "150px"}}>
                    <div>
                        <input
                            onKeyDown={handleKeyDown}
                            placeholder="Select user to chat!"
                            style={{width: "100%", height: "50px"}} type="text"
                            disabled={!friendIdLocal}
                            onChange={handleInputChange}
                            ref={messageRef}
                        />
                    </div>
                    {/*DISABLE BUTTON IF FRIEND IS NOT SELECTED*/}
                    <div style={{marginTop: "10px"}}>
                        <button disabled={!friendIdLocal || !activeBtn} onClick={sendMessage}>Send Message</button>
                        <button onClick={() => {
                            dispatch(restoreMessageThunk(messageId))
                        }}> restore last message
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

const DialogsChatMemoComponent = React.memo(DialogsChat)
export default  DialogsChatMemoComponent

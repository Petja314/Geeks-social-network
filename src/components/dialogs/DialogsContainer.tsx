import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {actionsDialogs, fetchDialogsThunk, newMessageReceivedThunk, refreshMessagesThunk, sendMessageThunk, startChatThunk} from "../redux/DialogsReducer";
import {FilterType, followUserThunkCreator, getUsersThunkCreator, unfollowUserThunkCreator, UsersComponentTypeArrays} from "../redux/UsersReducer";
import {getUsersFilterSelector, getUsersPageSelector} from "../redux/UsersSelectors";
import UsersSearchForm from "../users/UsersSearchForm";
import {NavLink} from "react-router-dom";
import UserAvatarPhoto from "../users/UserAvatarPhoto";

const DialogsContainer = () => {
    const dispatch: any = useDispatch()
    const {
        dialogs,
        newMessageCount,
        friendIdLocal,
        message,
        currentPage,
        pageSize,
        currentDialogsPage,
        pageSizeDialogs,
        pagesTotalCount,
        selectedUserName,
        messages
    } = useSelector((state: any) => state.messagesPage)

    const [prevNewMessageValue] = useState(0);
    const lastPageChat = Math.ceil(pagesTotalCount / pageSize)
    const [fetchingPage, setFetchingPage] = useState(false)
    const filter: FilterType = useSelector(getUsersFilterSelector)
    const scrollContainerRef = useRef<any>(null);
    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)


    useEffect(() => {
        dispatch(fetchDialogsThunk())
        dispatch(newMessageReceivedThunk())
        const pollingInterval = setInterval(async () => {
            // CALLING API GET REQUEST NEW MESSAGE RECEIVED? TO TRACK THE STATE IF THERE IS ANY NEW MESSAGES FROM USER. IF THERE IS , WE ARE FETCHING DIALOGS AND REFRESHING MESSAGES ONCE!
            dispatch(newMessageReceivedThunk())
        }, 5000)
        return () => {
            clearInterval(pollingInterval)
        }
    }, [newMessageCount])

    // CALL THE API ONLY WHEN NEW MESSAGE COMES UP FROM USER!
    useEffect(() => {
        if (newMessageCount !== prevNewMessageValue) {
            dispatch(fetchDialogsThunk())
            dispatch(refreshMessagesThunk(friendIdLocal, currentPage, pageSize))
            console.log('refreshing dialogs...')
        }
    }, [newMessageCount])

    //SCROLL AT THE BOTTOM BY DEFAULT
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages])

    // START CHAT WITH A SELECTED FRIEND
    const sendMessage = async () => {
        dispatch(sendMessageThunk(friendIdLocal, message))
        dispatch(actionsDialogs.setMessageLocalAction(''))
    };
    let pagesCount = Math.ceil(dialogs.length / pageSizeDialogs)
    const startIndex = (currentDialogsPage - 1) * pageSizeDialogs
    const endIndex = startIndex + pageSizeDialogs
    const displayedDialogs = dialogs.slice(startIndex, endIndex)


    const scrollHandlerMessages = (event: any) => {
        const element = event.currentTarget
        if (element.scrollTop === 0 && currentPage && currentPage !== lastPageChat) {
            element.scrollTop = 20
            setFetchingPage(true)
            dispatch(actionsDialogs.setCurrentPageAction(currentPage + 1))
            // When I am at the last page scroll is disappearing  !!!
        }
        if (element.scrollHeight - (element.scrollTop + element.clientHeight) < 1 && currentPage !== 1) {
            element.scrollTop = 100
            setFetchingPage(true)
            dispatch(actionsDialogs.setCurrentPageAction(currentPage - 1))
        }
    }
    const onPageChange = (pageNumber: number) => {
        if (currentDialogsPage) {
            dispatch(actionsDialogs.setCurrentDialogsPageAction(pageNumber))
        }
    }
    // const onFilterChanged = (filter: FilterType) => {
    //     // debugger
    //     dispatch(getUsersThunkCreator(1, pageSize, filter))
    // }

    const onFilterChanged = (filter: FilterType) => {
        debugger
        dispatch(actionsDialogs.findDialogAction(filter)); ///NEED TO DO FILTER DISTRUCTURIZATION!
        dispatch(getUsersThunkCreator(1, pageSize, filter))
        if (filter.term) {
            // If userName is provided in the filter, perform client-side filtering
            const filteredDialogs = dialogs.filter((dialog: any) => dialog.userName.includes(filter.term));
            dispatch(actionsDialogs.setAllDialogsAction(filteredDialogs));
            console.log('user found!')
        } else {
            // If userName is not provided, fetch all dialogs from the API
            console.log('not found!')
            dispatch(fetchDialogsThunk());
        }
    };
    // console.log('dialogs' , dialogs)

    return (
        <div style={{display: "flex", justifyContent: "space-around"}}>
            {/*DIALOGS*/}
            <div>
                <div style={{margin: "20px"}}>
                    <h2>DIALOGS CONTAINER TEST NET</h2>
                    <h3>RECENT DIALOGS</h3>
                    Current page : {currentDialogsPage}
                    <div>
                        <UsersSearchForm onFilterChanged={onFilterChanged} />
                    </div>
                </div>
                <div
                    style={{
                        border: "1px solid black", height: "400px", width: "500px", overflowY: "auto", textAlign: "center"
                    }}
                >
                    <div>
                        {displayedDialogs
                            .sort((a: any, b: any) => b.hasNewMessages - a.hasNewMessages)
                            .map((dialog: any) => (
                                <div key={dialog.id}>
                                    <div style={{paddingTop: "10px"}}>
                                        <div>{dialog.userName} </div>
                                        < NavLink to={'/dialogscontainer/' + dialog.id}>
                                        <button onClick={() => dispatch(startChatThunk(dialog.id, dialog.userName))}>Start Chat</button>
                                        </NavLink>
                                        <hr/>
                                    </div>
                                    {dialog.hasNewMessages && newMessageCount > 0 ? <div style={{color: "red"}}>
                                        You got {dialog.newMessagesCount} new message
                                    </div> : <div></div>
                                    }
                                </div>
                            ))}

                        {
                            usersPage.users.map((item: any) =>
                                <div key={item.id}>
                                    <div style={{paddingTop: "10px"}}>
                                        <div>User name : {item.name}</div>
                                        <NavLink to={'/dialogscontainer/' + item.id}>
                                            <button onClick={() => dispatch(startChatThunk(item.id, item.userName))}>Start Chat</button>
                                        </NavLink>
                                        <hr/>
                                    </div>
                                </div>
                            )}

                    </div>

                    <div style={{display: "flex", gap: "20px", justifyContent: "center", marginTop: "15px"}}>

                        <div>
                            {/*PREVIOUS PAGE BUTTON*/}
                            {currentDialogsPage > 1 &&
                                <button onClick={() => onPageChange(currentDialogsPage - 1)}> PREV PAGE </button>
                            }
                        </div>
                        <div>
                            {/*NEXT PAGE BUTTON*/}
                            {currentDialogsPage >= 1 && currentDialogsPage < pagesCount
                                &&
                                <button onClick={() => onPageChange(currentDialogsPage + 1)}> NEXT PAGE </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/*CHAT SECTION*/}
            <div>
                <div style={{textAlign: "center"}}>
                    <h3>CHAT</h3>
                    <div>current page : {currentPage}</div>
                </div>
                <div
                    ref={scrollContainerRef}
                    onScroll={scrollHandlerMessages}
                    style={{border: "1px solid black", height: "200px", width: "500px", overflowY: "auto"}}>

                    <div>{selectedUserName}</div>
                    {messages.map((message: any) => (
                        <div style={{padding: "10px"}} key={message.id}>
                            User: {message.senderName}
                            <div>Message : {message.body}</div>
                            <hr/>
                        </div>

                    ))}
                </div>
                {/*CHAT INNER SECTION*/}
                <div style={{border: "1px solid black", padding: "20px", width: "500px"}}>
                    <div>
                        <input placeholder="Select user to chat!" disabled={!friendIdLocal} style={{width: "100%", height: "50px"}} type="text" value={message}
                               onChange={(e) => dispatch(actionsDialogs.setMessageLocalAction(e.target.value))}/>
                    </div>
                    {/*DISABLE BUTTON IF FRIEND IS NOT SELECTED*/}
                    <div style={{marginTop: "10px"}}>
                        <button disabled={!friendIdLocal} onClick={sendMessage}>Send Message</button>
                    </div>
                </div>
            </div>


        </div>
    )
};

export default DialogsContainer



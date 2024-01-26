import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {actionsDialogs, fetchDialogsThunk, newMessageReceivedThunk, refreshMessagesThunk, sendMessageThunk, startChatThunk} from "../redux/DialogsReducer";
import {FilterType, followUserThunkCreator, getUsersThunkCreator, unfollowUserThunkCreator, UsersComponentTypeArrays} from "../redux/UsersReducer";
import {getCurrentPageSelector, getMessageValueDialogs, getTotalUsersCountSelector, getUsersFilterSelector, getUsersPageSelector} from "../redux/UsersSelectors";
import UsersSearchForm from "../users/UsersSearchForm";
import {NavLink} from "react-router-dom";
import UserAvatarPhoto from "../users/UserAvatarPhoto";
import './dialogs.css'
import {compose} from "redux";
import {WithAuthRedirect} from "../hoc/WithAuthRedirect";

const DialogsContainer = () => {
    const dispatch: any = useDispatch()
    const {
        dialogs,
        newMessageCount,
        friendIdLocal,
        currentPageChat,
        pageSize,
        currentDialogsPage,
        pageSizeDialogs,
        pagesTotalCount,
        selectedUserName,
        selectedUser ,
        messages
    } = useSelector((state: any) => state.messagesPage)
    const [prevNewMessageValue] = useState(0);
    const lastPageChat = Math.ceil(pagesTotalCount / pageSize)
    const [fetchingPage, setFetchingPage] = useState(false)
    const filter: FilterType = useSelector(getUsersFilterSelector)
    const scrollContainerRef = useRef<any>(null);
    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const currentPage: number = useSelector(getCurrentPageSelector)
    const messageRef = useRef<any>()


    useEffect(() => {
        dispatch(fetchDialogsThunk())
        dispatch(newMessageReceivedThunk())
        dispatch(actionsDialogs.setCurrentDialogsPageAction(1))// FIRST RENDER - FIRST PAGE
        if (currentDialogsPage === 1 && currentDialogsPage) {
            dispatch(getUsersThunkCreator(currentPage, pageSize, filter));
        }
        const pollingInterval = setInterval(async () => {
            // CALLING API GET REQUEST NEW MESSAGE RECEIVED? TO TRACK THE STATE IF THERE IS ANY NEW MESSAGES FROM USER. IF THERE IS , WE ARE FETCHING DIALOGS AND REFRESHING MESSAGES ONCE!
            dispatch(newMessageReceivedThunk())
        }, 55000)
        return () => {
            clearInterval(pollingInterval)
        }
    }, [newMessageCount])

    // CALL THE API ONLY WHEN NEW MESSAGE COMES UP FROM USER!
    useEffect(() => {
        if (newMessageCount !== prevNewMessageValue) {
            dispatch(fetchDialogsThunk())
            dispatch(refreshMessagesThunk(friendIdLocal, currentPageChat, pageSize))
            if (filter.term === "") { //When the new message received , set the first dialogs page!
                dispatch(actionsDialogs.setCurrentDialogsPageAction(1))
            }
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
        dispatch(sendMessageThunk(friendIdLocal, messageRef.current.value))
        if ( messageRef.current) {
            messageRef.current.value = ""
        }
    };
    let pagesCount = Math.ceil(dialogs.length / pageSizeDialogs)
    const startIndex = (currentDialogsPage - 1) * pageSizeDialogs
    const endIndex = startIndex + pageSizeDialogs
    const displayedDialogs = dialogs.slice(startIndex, endIndex)


    const scrollHandlerMessages = (event: any) => {
        const element = event.currentTarget
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
    const scrollDialogsHandler = (event: any) => {
        const elementDialogs = event.currentTarget
        const bottomOfPage = elementDialogs.scrollHeight - (elementDialogs.scrollTop + elementDialogs.clientHeight)
        const topOfPage = elementDialogs.scrollTop
        //DOWN ++
        if (bottomOfPage === 0) {
            const nextPage = currentDialogsPage + 1
            dispatch(actionsDialogs.setCurrentDialogsPageAction(nextPage))
            dispatch(getUsersThunkCreator(nextPage, pageSize, filter));
            elementDialogs.scrollTop = 700
        }
        //UP --
        if (currentDialogsPage > 1 && topOfPage === 0) {
            const prevPage = currentDialogsPage - 1
            dispatch(actionsDialogs.setCurrentDialogsPageAction(prevPage))
            dispatch(getUsersThunkCreator(prevPage, pageSize, filter));
            elementDialogs.scrollTop = 20
        }
    }

    const onFilterChanged = (filter: FilterType) => {
        // debugger
        filter = {...filter, friend: null, term: filter.term}
        dispatch(actionsDialogs.findDialogAction(filter));
        dispatch(getUsersThunkCreator(1, pageSize, filter))
        if (filter.term) {
            const filterDialogs = dialogs.filter((dialogs: any) => dialogs.userName.includes(filter.term))
            console.log('user found')
            // dispatch(actionsDialogs.setAllDialogsAction({...filter, friend: null, term: filterDialogs}))
            dispatch(actionsDialogs.setAllDialogsAction(filterDialogs))
            // console.log('filterDialogs' , filterDialogs)
        } else {
            console.log('user not found')
            dispatch(fetchDialogsThunk())
        }
        if (filter.term === "") {
            dispatch(actionsDialogs.setCurrentDialogsPageAction(1))
        }
    };
    return (
        <div >

            <h2 style={{marginBottom : "20px"}} >Messenger</h2>
            <div style={{
                position: "relative" , display : "flex"
            }}>

            {/*RECENT DIALOGS*/}
            <div>
                {/*    Current page : {currentDialogsPage}*/}
                <div
                    onScroll={scrollDialogsHandler}
                    style={{
                        border: "1px solid black", height: "500px", width: "350px", overflowY: "auto", paddingLeft: "50px"
                    }}
                >
                    <div className="sticky">
                        <div>
                            <UsersSearchForm onFilterChanged={onFilterChanged}/>
                        </div>
                    </div>

                    <div >


                        {displayedDialogs
                            .sort((a: any, b: any) => b.hasNewMessages - a.hasNewMessages) //SORTING THE NEW MESSAGES FIRST
                            .map((dialog: any) => (
                                <div key={dialog.id}>
                                    <div style={{paddingTop: "10px"}}>

                                        <div><UserAvatarPhoto photos={dialog.photos.small}/></div>
                                        <div>{dialog.userName} </div>

                                        <div>
                                            < NavLink to={'/dialogs/' + dialog.id}>
                                                <button onClick={() => dispatch(startChatThunk(dialog.id, dialog.userName , dialog.photos.small))}>Start Chat</button>
                                            </NavLink>
                                        </div>
                                        <hr style={{marginTop: "10px"}}/>
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

                                        <div><UserAvatarPhoto photos={item.photos.small}/></div>
                                        <div>User name : {item.name}</div>
                                        <NavLink to={'/dialogs/' + item.id}>
                                            <button onClick={() => dispatch(startChatThunk(item.id, item.name , item.photos.small))}>Start Chat</button>
                                        </NavLink>
                                        <hr style={{marginTop: "10px"}}/>
                                    </div>
                                </div>
                            )}

                    </div>

                </div>
            </div>


            {/*CHAT SECTION*/}
            <div style={{position : "relative"}} >
                    {/*<div>current page chat : {currentPageChat}</div>*/}
                <div
                    ref={scrollContainerRef}
                    onScroll={scrollHandlerMessages}
                    style={{border: "1px solid black", height: "350px", width: "500px", overflowY: "auto"}}>

                        <div className="sticky" >
                            <div>{selectedUser.selectedUserName}</div>
                            <div style={{maxWidth : "200px"}} ><UserAvatarPhoto photos={selectedUser.photo}/></div>
                        </div>


                    <div style={{paddingLeft : "30px"}} >
                        {messages.map((message: any) => (
                            <div style={{padding: "10px"}} key={message.id}>
                                User: {message.senderName}
                                <div style={{paddingTop : "10px"}} >Message : {message.body}</div>
                                <hr style={{marginTop : "10px"}}/>
                            </div>
                        ))}
                    </div>
                </div>


                {/*CHAT INNER SECTION*/}
                <div style={{border: "1px solid black", padding: "20px", width: "500px" ,height: "150px"}}>
                    <div>
                        <input placeholder="Select user to chat!" disabled={!friendIdLocal} style={{width: "100%", height: "50px"}} type="text"
                               ref={messageRef}
                        />
                    </div>
                    {/*DISABLE BUTTON IF FRIEND IS NOT SELECTED*/}
                    <div style={{marginTop: "10px"}}>
                        <button disabled={!friendIdLocal} onClick={sendMessage}>Send Message</button>
                    </div>
                </div>

            </div>

            </div>
        </div>
    )
};


const DialogsContainerMemoComponent = React.memo(DialogsContainer)
export default compose(
    WithAuthRedirect
)(DialogsContainerMemoComponent)






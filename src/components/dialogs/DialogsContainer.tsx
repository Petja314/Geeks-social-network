import React, {useEffect, useRef, useState} from 'react';
import {instance} from "../../api/Api";
import Login from "../login/Login";

const DialogsContainer = () => {
    // DIALOGS STATE
    const [dialogs, setDialogs] = useState([])
    const [newMessageCount, setNewMessageCount] = useState(0) //store the new message count from API //newMessageReceived.get
    const [prevNewMessageValue] = useState(0);
    const [currentDialogsPage, setCurrentDialogsPage] = useState(1)
    const [pageSizeDialogs, setPageSizeDialogs] = useState(5)

    // MESSENGER CHAT
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [pagesTotalCount, setPagesTotalCount] = useState<any>() //could be undefined
    const [selectedUserName, setSelectedUserName] = useState('')
    const [friendIdLocal, setFriendIdLocal] = useState()
    const [messages, setMessages] = useState([]);
    const lastPageChat = Math.ceil(pagesTotalCount / pageSize)
    const [message, setMessage] = useState('');
    const [fetchingPage, setFetchingPage] = useState(false)



    useEffect(() => {
        fetchDialogs()
        newMessageReceived()
        const pollingInterval = setInterval(async () => {
            // CALLING API GET REQUEST NEW MESSAGE RECEIVED? TO TRACK THE STATE IF THERE IS ANY NEW MESSAGES FROM USER. IF THERE IS , WE ARE FETCHING DIALOGS AND REFRESHING MESSAGES ONCE!
            newMessageReceived()
        }, 55000)
        return () => {
            clearInterval(pollingInterval)
        }
    }, [newMessageCount])


    // CALL THE API ONLY WHEN NEW MESSAGE COMES UP FROM USER!
    useEffect(() => {
        if ( newMessageCount !== prevNewMessageValue ) {
             fetchDialogs()
             refreshMessages(friendIdLocal)
            console.log('!POP UP!')
        }
    } , [newMessageCount])

    const fetchDialogs = async () => {
        const response = await instance.get('dialogs')
        if (response.status === 200) {
            setDialogs(response.data)
        }
    }

    const newMessageReceived = async () => {
        const response = await instance.get('dialogs/messages/new/count')
        // console.log('list of new messages ', response)
        if (response.status === 200) {
            setNewMessageCount(response.data)
        }
    }

    // START CHAT WITH A SELECTED FRIEND
    const startChat = async (friendId: any, userName: any) => {
        // Start chatting with a friend using the reusable axios instance
        // HERE YOU CAN MOVE LIST OF YOUR USERS !
        setCurrentPage(1)
        setSelectedUserName(userName)
        setFriendIdLocal(friendId)
        await instance.put(`dialogs/${friendId}`)
        await refreshMessages(friendId);
    };


    const sendMessage = async () => {
        // Send a message to a friend using the reusable axios instance
        await instance.post(`dialogs/${friendIdLocal}/messages`, {body: message})
        setMessage('');
        await refreshMessages(friendIdLocal);
    };


    // GET LIST OF MESSAGES WITH YOUR FRIEND
    // https://social-network.samuraijs.com/api/1.0/dialogs/undefined/messages?page=1&count=10
    const refreshMessages = async (friendId: any) => {
        // Fetch messages with a friend using the reusable axios instance
    // && newMessageCount > 0
        if (friendId) {
            console.log('refreshing new messages...')
            const response = await instance.get(`dialogs/${friendId}/messages?page=${currentPage}&count=${pageSize}`)
            setMessages(response.data.items)
            setPagesTotalCount(response.data.totalCount)
        }
    };


    // PAGINATION
    // CALCULATE INDEX OF CURRENT PAGE , LAST INDEX + FIRST INDEX
    let pagesCount = Math.ceil(dialogs.length / pageSizeDialogs)
    const startIndex = (currentDialogsPage - 1) * pageSizeDialogs
    const endIndex = startIndex + pageSizeDialogs
    const displayedDialogs = dialogs.slice(startIndex, endIndex)
    // console.log('dialogs total pages:' , pagesCount)


    // console.log('setMessages from api :' ,messages )
    // console.log('local dialogs', dialogs)
    // console.log('local list of new messages', newMessageCount)
    const scrollHandlerMessages =  (event: any) => {
        const element = event.currentTarget
        if (element.scrollTop === 0 && currentPage && currentPage !== lastPageChat) {
            element.scrollTop = 20
            setFetchingPage(true)
            setCurrentPage((prev) => prev + 1)
            // When I am at the last page scroll is disappearing  !!!
        }
        if (element.scrollHeight - (element.scrollTop + element.clientHeight) < 1 && currentPage !== 1) { //do not send an api request if we are trying to scroll below current page 1!
            element.scrollTop = 100
            setFetchingPage(true)
            setCurrentPage((prev) => prev - 1)
        }
    }

    const onPageChange = (pageNumber: number) => {
        if (currentDialogsPage) {
            setCurrentDialogsPage(pageNumber)
        }
    }

    return (
        <div style={{display: "flex", justifyContent: "space-around"}}>


            {/*DIALOGS*/}
            <div>
                <div style={{margin: "20px"}}>
                    <h2>DIALOGS CONTAINER TEST NET</h2>
                    <h3>RECENT DIALOGS</h3>
                    Current page : {currentDialogsPage}
                </div>

                <div

                    style={{
                        border: "1px solid black", height: "400px", width: "500px", overflowY: "auto",textAlign: "center"
                    }}
                >
                    <div>
                        {displayedDialogs
                            .sort((a: any, b: any) => b.hasNewMessages - a.hasNewMessages)
                            .map((dialog: any) => (
                                <div key={dialog.id}>


                                    <div style={{paddingTop: "10px"}}>
                                        <div>{dialog.userName} </div>
                                        <button onClick={() => startChat(dialog.id, dialog.userName)}>Start Chat</button>
                                        <hr/>
                                    </div>
                                    {/* Updated condition to check for new messages and current friendIdLocal */}
                                    {/*friendIdLocal = undefined with a first render , then when we click on button startChat, we set the firendIdLocal with a selectedId of user and dialog.id !== friendIdLocal becomes false , that's why the text is disappearing */}
                                    {/*----------------------------------------------------*/}
                                    {dialog.hasNewMessages && newMessageCount > 0 ? <div style={{color: "red"}}>
                                        You got {dialog.newMessagesCount} new message
                                    </div> : <div></div>
                                    }
                                </div>
                            ))}
                    </div>

                    <div style={{display : "flex" , gap : "20px", justifyContent : "center", marginTop: "15px"}} >

                        <div>
                            {/*PREVIOUS PAGE BUTTON*/}
                            {currentDialogsPage > 1 &&
                                <button onClick={() => onPageChange(currentDialogsPage -1)}> PREV PAGE </button>
                            }
                        </div>

                        <div>
                            {/*NEXT PAGE BUTTON*/}
                            {currentDialogsPage >= 1 && currentDialogsPage < pagesCount
                                &&
                                <button onClick={() => onPageChange(currentDialogsPage +1)}> NEXT PAGE </button>
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
                <div style={{border: "1px solid black", padding: "20px", width: "500px"  }}>
                    <div>
                        <input placeholder="Select user to chat!" disabled={!friendIdLocal} style={{width: "100%", height: "50px"}} type="text" value={message}
                               onChange={(e) => setMessage(e.target.value)}/>
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



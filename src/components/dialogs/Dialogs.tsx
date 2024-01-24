import React, {useState, useEffect, useRef} from 'react';
import {instance} from "../../api/Api";
import {FilterType, getUsersThunkCreator, UsersComponentTypeArrays} from "../redux/UsersReducer";
import {useDispatch, useSelector} from "react-redux";
import {getUsersFilterSelector, getUsersPageSelector} from "../redux/UsersSelectors";
import UsersSearchForm from "../users/UsersSearchForm";

const Dialogs = () => {
    const [message, setMessage] = useState('');
    const [dialogs, setDialogs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [friendIdLocal, setFriendIdLocal] = useState()
    const [selectedUserName, setSelectedUserName] = useState('')
    const [fetchingPage, setFetchingPage] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [pagesTotalCount, setPagesTotalCount] = useState<any>() //could be undefined
    const scrollContainerRef = useRef<any>(null);
    const lastPageChat = Math.ceil(pagesTotalCount / pageSize)
    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const filter: FilterType = useSelector(getUsersFilterSelector)
    const dispatch : any = useDispatch()



    // GET ALL DIALOGS FROM USERS
    useEffect(() => {
        //Fetch all dialogs
        fetchData();
        // Start periodic request for new messages
        const pollingInterval = setInterval(async () => {
            await refreshMessages(friendIdLocal); // AWAIT - each iteration of the interval waits for the asynchronous operations to complete
            await fetchData(); // fetch all dialogs every 5 second to get a notification about the new message!
            console.log('refreshing messages...');
        }, 55000); // Poll every 5 seconds (adjust as needed) 5000
        return () => {
            // Cleanup on component unmount
            clearInterval(pollingInterval);
        };
    }, [friendIdLocal]);

    useEffect(() => {
        if (fetchingPage) {
            instance.get(`dialogs/${friendIdLocal}/messages?page=${currentPage}&count=${pageSize}`).then((response) => {
                setMessages(response.data.items)
            })
                .finally(() => setFetchingPage(false))
        }
    }, [fetchingPage])

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [dialogs])

    // GET ALL DIALOGS
    const fetchData = async () => {
        try {
            const response = await instance.get('dialogs');
            setDialogs(response.data);
            // console.log('dialogs: ', response.data);
        } catch (error) {
            console.error('Error fetching dialogs:', error);
        }
    };

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

    // GET LIST OF MESSAGES WITH YOUR FRIEND
    // https://social-network.samuraijs.com/api/1.0/dialogs/undefined/messages?page=1&count=10
    const refreshMessages = async (friendId: any) => {
        // Fetch messages with a friend using the reusable axios instance
        if (friendId) {
            const response = await instance.get(`dialogs/${friendId}/messages?page=${currentPage}&count=${pageSize}`)
            setMessages(response.data.items)
            setPagesTotalCount(response.data.totalCount)
        }
    };
    // SENDING THE MESSAGE TO THE FRIEND
    const sendMessage = async () => {
        // Send a message to a friend using the reusable axios instance
        await instance.post(`dialogs/${friendIdLocal}/messages`, {body: message})
        setMessage('');
        await refreshMessages(friendIdLocal);
    };
    const scrollHandler = async (event: any) => {
        const element = event.currentTarget
        // console.log('element.scrollHeight' , element.scrollHeight)
        // console.log('element.scrollTop' , element.scrollTop)
        // console.log('element.clientHeight' , element.clientHeight)
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

    // USER SECTION
    console.log('usersPage' , usersPage)
        const onFilterChanged = (filter: FilterType) => {
        // debugger
        dispatch(getUsersThunkCreator(1, pageSize, filter))
    }

    return (
        <div>
            <h2 style={{textAlign : "center", marginBottom : "20px"}} >Dialogs</h2>


            <div style={{display: "flex", justifyContent: "space-around"}}>
                {/*USERS SECTION*/}
                <div>
                    <h3>Users to chat</h3>
                    <UsersSearchForm
                        filter={filter.friend}
                        onFilterChanged={onFilterChanged}
                    />

                    <div style={{marginTop: "10px"}}>
                        {
                            usersPage.users.map((item) =>
                                <div style={{border: "1px solid black", padding: "20px", width: "200px"}} key={item.id}>
                                    <div>{item.name} </div>
                                    <button onClick={() => startChat(item.id, item.name)}>Start Chat</button>
                                </div>
                            )}
                    </div>

                </div>


                {/*DIALOGS SECTION*/}
                <div>
                    <h3>Dialogs List</h3>
                    {/*<input type="text" placeholder="Search Messenger"/>*/}
                    {/*<button>Find</button>*/}
                    <div>
                        <h3>recent dialogs</h3>
                        {dialogs
                            .sort((a: any, b: any) => b.hasNewMessages - a.hasNewMessages)
                            .map((dialog: any) => (
                                <div style={{border: "1px solid black", padding: "20px", width: "200px"}} key={dialog.id}>
                                    <div>{dialog.userName} </div>
                                    <button onClick={() => startChat(dialog.id, dialog.userName)}>Start Chat</button>
                                    {/* Updated condition to check for new messages and current friendIdLocal */}
                                    {/*friendIdLocal = undefined with a first render , then when we click on button startChat, we set the firendIdLocal with a selectedId of user and dialog.id !== friendIdLocal becomes false , that's why the text is disappearing */}
                                    {dialog.hasNewMessages && dialog.newMessagesCount > 0 && dialog.id !== friendIdLocal ? (
                                        <div style={{color: "red"}}>
                                            You got {dialog.newMessagesCount} new message
                                        </div>
                                    ) : null}

                                </div>
                            ))}
                    </div>
                </div>


                {/*CHAT SECTION*/}
                <div>
                    <div style={{textAlign: "center"}}>
                        <h3>CHAT</h3>
                        <div>current page : {currentPage}</div>
                    </div>
                    <div ref={scrollContainerRef}
                         onScroll={scrollHandler}
                         style={{border: "1px solid black", height: "200px", overflowY: "auto"}}>

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
                                   onChange={(e) => setMessage(e.target.value)}/>
                        </div>
                        {/*DISABLE BUTTON IF FRIEND IS NOT SELECTED*/}
                        <div style={{marginTop: "10px"}}>
                            <button disabled={!friendIdLocal} onClick={sendMessage}>Send Message</button>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    );
};

export default Dialogs
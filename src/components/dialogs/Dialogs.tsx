import React, {useState, useEffect} from 'react';
import {instance} from "../../api/Api";
import {UsersComponentTypeArrays} from "../redux/UsersReducer";
import {useSelector} from "react-redux";
import {getUsersPageSelector} from "../redux/UsersSelectors";

const Dialogs = () => {
    const [message, setMessage] = useState('');
    const [dialogs, setDialogs] = useState([]);
    const [messages, setMessages] = useState([]);
    const [friendIdLocal, setFriendIdLocal] = useState()
    const [selectedUserName, setSelectedUserName] = useState('')
    const [isAutoScroll,setIsAutoScroll] = useState(true)


    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const currentPage = 1
    const pageSize = 5;

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


    // GET ALL DIALOGS
    const fetchData = async () => {
        try {
            const response = await instance.get('dialogs');
            setDialogs(response.data);
            console.log('dialogs: ', response.data);
        } catch (error) {
            console.error('Error fetching dialogs:', error);
        }
    };

    // START CHAT WITH A SELECTED FRIEND
    const startChat = async (friendId: any, userName: any) => {
        // Start chatting with a friend using the reusable axios instance
        // HERE YOU CAN MOVE LIST OF YOUR USERS !
        setSelectedUserName(userName)
        setFriendIdLocal(friendId)
        await instance.put(`dialogs/${friendId}`)
        await refreshMessages(friendId);
    };

    // GET LIST OF MESSAGES WITH YOUR FRIEND
    // https://social-network.samuraijs.com/api/1.0/dialogs/undefined/messages?page=1&count=10
    const refreshMessages = async (friendId: any) => {
        // Fetch messages with a friend using the reusable axios instance
        if (friendId ) {
            const response = await  instance.get(`dialogs/${friendId}/messages?page=${currentPage}&count=${pageSize}`)
            setMessages(response.data.items)
        }
    };
    // SENDING THE MESSAGE TO THE FRIEND
    const sendMessage = async () => {
        // Send a message to a friend using the reusable axios instance
        await instance.post(`dialogs/${friendIdLocal}/messages`, {body: message})
        setMessage('');
        await refreshMessages(friendIdLocal);
    };

    // console.log('messages', messages)
    // if (dialogs) {
    //     console.log('dialogs', dialogs)
    // }
    // console.log('friendIdLocal', friendIdLocal)

    const scrollHandler = (event : any) => {
        const element = event.currentTarget
        if (Math.abs( (element.scrollHeight - element.scrollTop) - element.clientHeight ) < 300) {
            !isAutoScroll && setIsAutoScroll(true)
        }
        else {
            isAutoScroll && setIsAutoScroll(false)
        }
    }

    return (
        <div>
            <h2>Dialogs</h2>


            <div style={{display: "flex", justifyContent: "space-around"}}>

                <div>
                    <h3>Dialogs List</h3>
                    <input type="text" placeholder="Search Messenger"/>
                    <button>Find</button>

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

                    {/*<div style={{marginTop: "10px"}}>*/}
                    {/*    {*/}
                    {/*        usersPage.users.map((item) =>*/}
                    {/*            <div style={{border: "1px solid black", padding: "20px", width: "200px"}} key={item.id}>*/}
                    {/*                <div>{item.name} </div>*/}
                    {/*                <button onClick={() => startChat(item.id, item.name)}>Start Chat</button>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*</div>*/}

                </div>


                <div>
                    <div style={{textAlign: "center"}}>
                        <h3>CHAT</h3>
                    </div>


                    <div style={{border: "1px solid black", padding: "20px", width: "500px", marginTop: "10px"}} onScroll={scrollHandler}>
                        <div>{selectedUserName}</div>
                        {messages.map((message: any) => (
                            <div style={{padding: "10px"}} key={message.id}>
                                User: {message.senderName}
                                <div>Message : {message.body}</div>
                                <hr/>
                            </div>

                        ))}
                    </div>


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
import React, {UIEventHandler, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import {sendMessageThunk, startMessagesListeningThunk, stopMessagesListeningThunk} from "../../redux/ChatReducer";
import {RootState} from "../../redux/Redux-Store";

export type ChatMessageType = {
    "userId": number,
    "userName": string,
    "message": string,
    "photo": string
}
const ChatPage = () => {
    return (
        <div>
            <Chat/>
        </div>
    );
};
const Chat = () => {
    const dispatch: Dispatch = useDispatch()
    const status = useSelector((state: RootState) => state.chat.status)

    useEffect(() => {
        dispatch(startMessagesListeningThunk())
        return () => {
            dispatch(stopMessagesListeningThunk())
        }
    }, [])

    return (
        <div>
            {status === 'error' && <div>Some error occurred. Please refresh the page</div> }
                <div>
                    <Messages/>
                    <AddMessageForm/>
                </div>

        </div>
    );
};
const Messages: React.FC = ({}) => {
    const messages = useSelector((state: RootState) => state.chat.messages)
    const messagesAnchorRef = useRef<HTMLDivElement>(null)
    const [isAutoScroll,setIsAutoScroll] = useState(true)
    const scrollHandler = (event : any) => {
        const element = event.currentTarget
        if (Math.abs( (element.scrollHeight - element.scrollTop) - element.clientHeight ) < 300) {
            !isAutoScroll && setIsAutoScroll(true)
        }
        else {
            isAutoScroll && setIsAutoScroll(false)
        }
    }
    useEffect(() => {
        if (isAutoScroll) {
            messagesAnchorRef.current?.scrollIntoView({behavior : 'smooth'})
        }
    },[messages])

    return (
        <div style={{height: "300px", overflowY: "auto"}} onScroll={scrollHandler}>
            {messages.map((item: any, index: any) => <Message key={index} message={item}/>)}

            <div ref={messagesAnchorRef} ></div>
        </div>
    );
};

const Message: React.FC<{ message: ChatMessageType }> = ({message}) => {
    return (
        <div>
            <img style={{"width": "40px"}} src={message.photo}/> <b>{message.userName}</b>
            <br/>
            {message.message}
            <hr/>
        </div>
    )
}

const AddMessageForm: React.FC = ({}) => {
    const [message, setMessage] = useState('')
    const dispatch: Dispatch = useDispatch()
    const status = useSelector((state: RootState) => state.chat.status)

    const sendMessageHandler = () => {
        if (!message) {
            return
        }

        dispatch(sendMessageThunk(message))
        setMessage('')
    }

    return (
        <div>
            <div>
                <textarea onChange={(event) => setMessage(event.currentTarget.value)} value={message}></textarea>
            </div>
            <div>
                <button disabled={status !== 'ready'} onClick={sendMessageHandler}>send</button>

            </div>
        </div>
    );
};

export default ChatPage;


//
// import React, {useEffect, useState} from 'react';
//
// export type ChatMessageType = {
//     "userId": number,
//     "userName": string,
//     "message": string,
//     "photo": string
// }
// const ChatPage = () => {
//     return (
//         <div>
//             <Chat/>
//         </div>
//     );
// };
// const Chat = () => {
//     const [wsChannel, setWsChannel] = useState<WebSocket | null>(null)
//     const [loading, setLoading] = useState(true);
//
//
//     useEffect(() => {
//         let ws: WebSocket | null = null;
//
//         const closeHandler = () => {
//             console.log('CLOSE WS');
//             setLoading(true);
//             setTimeout(createChannel, 3000);
//         };
//
//         function createChannel() {
//             if (ws !== null) {
//                 ws.removeEventListener('close', closeHandler);
//             }
//             ws = new WebSocket("wss://social-network.samuraijs.com/handlers/ChatHandler.ashx");
//             ws.addEventListener('open', () => {
//                 setLoading(false);
//             });
//
//             ws.addEventListener('close', closeHandler);
//             setWsChannel(ws);
//         }
//         createChannel();
//
//         // Cleanup: Close the WebSocket when the component is unmounted
//         return () => {
//             if (ws !== null) {
//                 ws.removeEventListener('close', closeHandler);
//                 ws.close();
//             }
//         };
//     }, []); // Only run once during component mount
//
//     if (loading) {
//         return <div>Loading...</div>;
//     }
//     return (
//         <div>
//             <Messages wsChannel={wsChannel}/>
//             <AddMessageForm wsChannel={wsChannel}/>
//         </div>
//     );
// };
// const Messages: React.FC<{ wsChannel: WebSocket | null }> = ({wsChannel}) => {
//
//     const [messages, setMessages] = useState<any>([])
//
//     useEffect(() => {
//         const messageHandler = (event: any) => {
//             const newMessages = JSON.parse(event.data);
//             setMessages((prevMessage: any) => [...prevMessage, ...newMessages]);
//         };
//         wsChannel?.addEventListener('message', messageHandler);
//         // Cleanup: Remove the event listener when the component is unmounted
//         return () => {
//             wsChannel?.removeEventListener('message', messageHandler);
//         };
//     }, [])
//
//     return (
//         <div style={{height: "300px", overflowY: "auto"}}>
//             {messages.map((item: any, index: any) => <Message key={index} message={item}/>)}
//         </div>
//     );
// };
//
// const Message: React.FC<{ message: ChatMessageType }> = ({message}) => {
//
//
//     return (
//         <div>
//             <img style={{"width": "40px"}} src={message.photo}/> <b>{message.userName}</b>
//             <br/>
//             {message.message}
//             <hr/>
//         </div>
//     )
// }
//
// const AddMessageForm: React.FC<{ wsChannel: WebSocket | null }> = ({wsChannel}) => {
//     const [message, setMessage] = useState('')
//     const [isReady, setIsReady] = useState<'pending' | 'ready'>('ready')
//
//     useEffect(() => {
//         let openHandler = () => {
//             setIsReady('ready')
//         }
//         wsChannel?.addEventListener('open', openHandler)
//
//         return () => {
//             wsChannel?.removeEventListener('open', openHandler)
//         }
//
//     }, [])
//
//     const sendMessage = () => {
//         if (!message) {
//             return
//         }
//
//         wsChannel?.send(message)
//         setMessage('')
//     }
//
//     return (
//         <div>
//             <div>
//                 <textarea onChange={(event) => setMessage(event.currentTarget.value)} value={message}></textarea>
//             </div>
//             <div>
//                 <button onClick={sendMessage}>send</button>
//
//             </div>
//         </div>
//     );
// };
//
// export default ChatPage;


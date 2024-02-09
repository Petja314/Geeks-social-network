import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendMessageThunk, startMessagesListening, stopMessagesListening, WebSocketStateType} from "../../redux/FloodChatReducer";
import {RootState} from "../../redux/Redux-Store";
import {MessageInfoType} from "../../api/FloodChatApi";
import {compose} from "redux";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import "../../css/open_ai/openai-flood-chat.css"
import sendBtn from "../../assets/images/icons/send.png";

const FloodChat = () => {
    const dispatch: any = useDispatch()
    const messages: MessageInfoType[] = useSelector((state: RootState) => state.demoChatPage.messages)
    const scrollContainerRef = useRef<HTMLInputElement>(null);
    console.log('render')

    useEffect(() => {
        //Start listening msg. when component mounts
        dispatch(startMessagesListening())
        return () => {
            //Stop listening msg. when component unmounts
            dispatch(stopMessagesListening())
        }
    }, [])

    //SCROLL AT THE BOTTOM BY DEFAULT
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages])


    console.log('messages', messages)
    return (
        <div className="open_ai_container">
            <div className="openai_section">
                <div className="title"><h1>CHAT</h1></div>

                < div
                    ref={scrollContainerRef}
                    style={{
                        overflowY: 'auto',
                    }}
                >
                    <div className="response_section">
                        {messages.map((item: MessageInfoType, index: number) => (
                            < div key={item.userId}>

                                <img style={{width: '40px', borderRadius: '50%'}} src={item.photo} alt=""/>

                                <span style={{fontWeight: 'bold', color: '#1890ff'}}>
                  {item.userName}
                </span>
                                <p>{item.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <AddMessageForm/>
            </div>
        </div>
    );
};

const AddMessageForm = () => {
    const dispatch: any = useDispatch()
    const [inputMessage, setInputMessage] = useState<string>('');
    const sendMessage = () => {
        console.log()
        if (!inputMessage.trim()) {
            alert('Please enter a message')
            // message.warning('Please enter a message');
            return;
        }
        dispatch(sendMessageThunk(inputMessage))
        setInputMessage('');
    };

    return (
        <div className="openai_inner_section">
            <div className="input-container">
                <textarea value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}/>
                <button  className="submit-button" onClick={sendMessage}>
                    <img src={sendBtn} alt=""/>
                    {/*Submit*/}
                </button>
            </div>

        </div>
    )
}


const FloodChatMemoComponent = React.memo(FloodChat)
export default compose(
    WithAuthRedirect
)(FloodChatMemoComponent)
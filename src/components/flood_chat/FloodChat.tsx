import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, Row, Col, message } from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {sendMessageThunk, startMessagesListening, stopMessagesListening, WebSocketStateType} from "../redux/FloodChatReducer";
import {RootState} from "../redux/Redux-Store";
import {MessageInfoType} from "../../api/FloodChatApi";
import InfiniteScroll from "react-infinite-scroll-component";
const { TextArea } = Input;
const FloodChat = () => {
    const [inputMessage, setInputMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const dispatch : any = useDispatch()
    const messages: WebSocketStateType[] = useSelector((state : RootState) => state.demoChatPage.messages)
    // console.log("messages state : " , messages)
    console.log('render')

    useEffect(() => {
        //Start listening msg. when component mounts
        dispatch(startMessagesListening())
        return () => {
            //Stop listening msg. when component unmounts
            dispatch(stopMessagesListening())
        }
    }, [])
    const sendMessage = () => {
        if (!inputMessage.trim()) {
            message.warning('Please enter a message');
            return;
        }
        dispatch(sendMessageThunk(inputMessage))
        setInputMessage('');
    };

    // Scroll to the bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const scrollHandler = () => {

    }

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <InfiniteScroll
                style={{overflow: 'hidden'}}
                dataLength={messages.length} //This is important field to render the next data
                next={scrollHandler}
                hasMore={true}
                loader={<h4>loading...</h4>}
                inverse={true}
                // ----
            >

            <Row justify="center">
                <Col>
                    <h2 style={{ color: '#1890ff' }}>CHAT</h2>
                </Col>
            </Row>

            < div
                style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    marginBottom: '20px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: '#f5f5f5',
                }}
            >

                {messages.map((item: any, index: any) => (
                    < div key={index} style={{ marginBottom: '10px' }} >
                        <Row align="middle" gutter={[16, 16]}>
                            <Col>
                                <img style={{ width: '40px', borderRadius: '50%' }} src={item.photo} alt="" />
                            </Col>
                            <Col>
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                  {item.userName} | ID: {item.userId}
                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>{item.message}</p>
                            </Col>
                        </Row>
                    </div >

                ))}
            </div>
                <div ref={messagesEndRef}> </div>


            <Row justify="center">
                <Col>
                    <hr style={{ border: '1px solid #ddd' }} />
                </Col>
            </Row>

            <Row justify="center">
                <Col span={24}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col span={18}>
                            <TextArea
                                rows={4}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                style={{ borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                        </Col>
                        <Col span={6}>
                            <Button
                                type="primary"
                                onClick={sendMessage}
                                style={{ backgroundColor: '#1890ff', border: '1px solid #1890ff', width: '100%', borderRadius: '5px' }}
                            >
                                Send Message
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            </InfiniteScroll>

        </div>
    );
};

export const SendMessageToChat = () => {

    return (
        <div>

        </div>
    )
}


export default FloodChat;
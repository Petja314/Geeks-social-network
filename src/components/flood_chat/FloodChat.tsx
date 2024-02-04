import React, {useEffect, useState, useRef} from 'react';
import {Input, Button, Row, Col, message} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {sendMessageThunk, startMessagesListening, stopMessagesListening, WebSocketStateType} from "../../redux/FloodChatReducer";
import {RootState} from "../../redux/Redux-Store";
import {MessageInfoType} from "../../api/FloodChatApi";
import {compose} from "redux";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
const {TextArea} = Input;
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


    console.log('messages' , messages)
    return (
        <div style={{maxWidth: '700px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px'}}>
                <Row justify="center">
                    <Col>
                        <h2 style={{color: '#1890ff'}}>CHAT</h2>
                    </Col>
                </Row>

                < div
                    ref={scrollContainerRef}
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
                    {messages.map((item: MessageInfoType, index: number) => (
                        < div  key={item.userId} >
                            <Row align="middle" gutter={[16, 16]}>
                                <Col>
                                    <img style={{width: '40px', borderRadius: '50%'}} src={item.photo} alt=""/>
                                </Col>
                                <Col>
                <span style={{fontWeight: 'bold', color: '#1890ff'}}>
                  {item.userName}
                </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>{item.message}</p>
                                </Col>
                            </Row>
                        </div>

                    ))}

                </div>



                <Row justify="center">
                    <Col>
                        <hr style={{border: '1px solid #ddd'}}/>
                    </Col>
                </Row>
                <AddMessageForm/>

        </div>
    );
};

const AddMessageForm = () => {
    const dispatch: any = useDispatch()
    const [inputMessage, setInputMessage] = useState<string>('');
    const sendMessage = () => {
        console.log()
        if (!inputMessage.trim()) {
            message.warning('Please enter a message');
            return;
        }
        dispatch(sendMessageThunk(inputMessage))
        setInputMessage('');
    };

    return (
        <div>
            <Row justify="center">
                <Col span={24}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col span={18}>
                            <TextArea
                                rows={4}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                style={{borderRadius: '5px', border: '1px solid #ddd'}}
                            />
                        </Col>
                        <Col span={6}>
                            <Button
                                type="primary"
                                onClick={sendMessage}
                                style={{backgroundColor: '#1890ff', border: '1px solid #1890ff', width: '100%', borderRadius: '5px'}}
                            >
                                Send Message
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}


const FloodChatMemoComponent = React.memo(FloodChat)
export default compose(
    WithAuthRedirect
)(FloodChatMemoComponent)


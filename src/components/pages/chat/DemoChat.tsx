

// const DemoChat = () => {
//
//     const [socketChannel, setSocketChannel] = useState<WebSocket | null>(null)
//     const [message, setMessage] = useState<any>([])
//     const [inputMessage, setInputMessage] = useState('')
//
//     console.log('socketChannel : ' , socketChannel)
//     // console.log('inputMessage : ' , inputMessage)
//     // console.log('message : ' , message)
//
//
//     useEffect(() => {
//         // Создаем новый WebSocket
//         let socket = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');
//         setSocketChannel(socket)
//         // console.log('socket', socket)
//
//         // Событие открытия соединения
//         // socket.onopen = () => {
//         //     console.log('WebSocket connection opened');
//         //     // Можно отправить какие-то данные после открытия соединения
//         //     // socket.send('Hello server!');
//         //     alert('connected')
//         // };
//
//
//         // Событие получения данных от сервера
//         socket.onmessage = (event: MessageEvent) => {
//             console.log('Received message:', JSON.parse(event.data));
//             // setMessage( JSON.parse(event.data) )
//             let newMessage = JSON.parse(event.data)
//             setMessage((prevMessages: any) => [...prevMessages, ...newMessage])
//             // Обработка полученных данных
//         };
//
//         // Событие закрытия соединения
//         socket.onclose = (event) => {
//             console.log('WebSocket connection closed:', event);
//         };
//
//         // Очистка ресурсов при размонтировании компонента
//         return () => {
//             socket.close();
//         };
//     }, []);
//     const sendMessage = () => {
//
//         if(!inputMessage.trim()) {
//             return
//         }
//         socketChannel?.send(inputMessage)
//         setInputMessage('')
//     }
//
//     // const sendMessage = () => {}
//
//     console.log(message)
//     return (
//         <div>
//
//             <div>
//                 <h2>CHAT</h2>
//             </div>
//
//
//             <div style={{"width": "50%"}}>
//                 {message.map((item: any, index: any) => {
//                     return <div>
//                         <div><img  style={{"width" : "40px"}} src={item.photo} alt=""/>  User Name : {item.userName} id : {item.userId} </div>
//                         <div>Message : {item.message}</div>
//                         <hr/>
//                     </div>
//                 })}
//             </div>
//
//
//             <div>
//                 <hr/>
//             </div>
//
//
//             <div>
//                 <div>
//                     <input type="text" onChange={(event) => setInputMessage(event.currentTarget.value)}/>
//                 </div>
//                 <div>
//                     <button onClick={sendMessage} >send message</button>
//                 </div>
//             </div>
//
//
//         </div>
//     );
// };
//
// export default DemoChat;


//VERSION 2 WITH DESIGN USING CHATGPT

import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, Row, Col, message } from 'antd';

const { TextArea } = Input;

const DemoChat = () => {
    const [socketChannel, setSocketChannel] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let socket = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');
        setSocketChannel(socket);

        socket.onmessage = (event: MessageEvent) => {
            let newMessage = JSON.parse(event.data);
            setMessages((prevMessages: any) => [...prevMessages, ...newMessage]);
        };

        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (!inputMessage.trim()) {
            message.warning('Please enter a message');
            return;
        }
        socketChannel?.send(inputMessage);
        setInputMessage('');
    };

    // Scroll to the bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <Row justify="center">
                <Col>
                    <h2 style={{ color: '#1890ff' }}>CHAT</h2>
                </Col>
            </Row>

            <div
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
                    <div key={index} style={{ marginBottom: '10px' }}>
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
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

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
        </div>
    );
};

export default DemoChat;
let subscribers = {
    'messages-received': [] as MessagesReceivedSubscriberType[],
    'status-changed': [] as StatusChangedSubscriberType[],
}

let ws: WebSocket | null = null;
type EventsNames = 'messages-received' | 'status-changed'

const closeHandler = () => {
    console.log('CLOSE WS');
    notifySubscribersAboutStatus('pending')
    setTimeout(createChannel, 3000);
};
const cleanUp = () => {
    ws?.removeEventListener('close', closeHandler);
    ws?.removeEventListener('message', messageHandler)
    ws?.removeEventListener('open', openHandler)
    ws?.removeEventListener('error',errorHandler)
}
const messageHandler = (event: any) => {
    const newMessages = JSON.parse(event.data);
    subscribers['messages-received'].forEach(item => item(newMessages))
    // setMessages((prevMessage: any) => [...prevMessage, ...newMessages]);
};
const openHandler = () => {
    notifySubscribersAboutStatus('ready')
};
const errorHandler = () => {
    notifySubscribersAboutStatus('error')
    console.error('REFRESH PAGE')
};

const notifySubscribersAboutStatus = (status : StatusType) => {
    // debugger
    subscribers['status-changed'].forEach(item => item(status))
}

function createChannel() {
    console.log('creating channel')
    cleanUp()
    if (ws !== null) {
        ws.removeEventListener('close', closeHandler);
    }
    ws = new WebSocket("wss://social-network.samuraijs.com/handlers/ChatHandler.ashx");
    notifySubscribersAboutStatus('pending')
    ws.addEventListener('close', closeHandler);
    ws.addEventListener('message', messageHandler)
    ws.addEventListener('open', openHandler)
    ws.addEventListener('error',errorHandler)
}

export const chatAPI = {
    start() {
        createChannel()
    },
    stop() {
        subscribers['messages-received'] = []
        subscribers['status-changed'] = []
        cleanUp()
        ws?.close()
    },
    //callback is function where we can send array of messages : callback = (messages[]) => void
    subscribe(eventName: EventsNames, callback: MessagesReceivedSubscriberType | StatusChangedSubscriberType) {
        // debugger
        // @ts-ignore
        subscribers[eventName].push(callback)
        return () => {
            // @ts-ignore
            subscribers[eventName] = subscribers[eventName].filter(item => item !== callback)
        }
    },
    unsubscribe(eventName: EventsNames, callback: MessagesReceivedSubscriberType | StatusChangedSubscriberType) {
        // @ts-ignore
        subscribers[eventName] = subscribers[eventName].filter(item => item !== callback)
    },
    sendMessage(message: string) {
        ws?.send(message)
    }
}

type MessagesReceivedSubscriberType = (messages: ChatMessageType[]) => void
type StatusChangedSubscriberType = (status: StatusType) => void

export type ChatMessageType = {
    userId: number;
    userName: string;
    message: string;
    photo: string;
};
export type StatusType = 'pending' | 'ready' | 'error'

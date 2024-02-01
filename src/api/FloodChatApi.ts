//Type for the callback function that will receive messages
type SubscriberType = (messages : MessageInfoType) => void
//Array to store subscribers (callback function)
let subscribers = [] as SubscriberType[]
//WebSocket instance
let ws: WebSocket | null = null;

export type MessageInfoType = {
    message : string,
    photo :string,
    userId : number,
    userName : string
}

//Function to create a new WebSocket channel
function createChannel() {
    console.log('creating channel')
    cleanUp() // Clean up existing WebSocket listeners
    if (ws !== null) {
        ws.removeEventListener('close', closeHandler);
    }
    ws = new WebSocket("wss://social-network.samuraijs.com/handlers/ChatHandler.ashx");
    ws.addEventListener('close', closeHandler);
    ws.addEventListener('message', messageHandler)
    ws.addEventListener('open', openHandler)
    ws.addEventListener('error',errorHandler)
}

// Handler for WebSocket close event
const closeHandler = () => {
    console.log('CLOSE WS');
    setTimeout(createChannel, 3000);
};

//Clean up WebSocket listeners
const cleanUp = () => {
    ws?.removeEventListener('close', closeHandler);
    ws?.removeEventListener('message', messageHandler)
    ws?.removeEventListener('open', openHandler)
    ws?.removeEventListener('error',errorHandler)
}
//Handler for incoming messages
const messageHandler = (event: any) => {
    const newMessages = JSON.parse(event.data);
    subscribers.forEach((item : any) => item(newMessages))
};
const openHandler = () => {
    console.log('Connection opened successfully')
};
const errorHandler = () => {
    console.error('REFRESH PAGE')
};


export const DemoChatApi = {
    start_websocket() {
        createChannel()
    },
    //callback is function where we can send array of messages : callback = (messages[]) => void
    //Subscribe to new messages and return an unsubscribe function
    subscribe(callback: SubscriberType) {
        subscribers.push(callback)
        return () => {
            subscribers= subscribers.filter(item => item !== callback)
        }
    },
    // Unsubscribe from new messages
    unsubscribe(callback: SubscriberType) {
        subscribers = subscribers.filter(item => item !== callback)
    },
    //Send new message through WebSocket
    send_message(message: string) {
        ws?.send(message)
    }
}




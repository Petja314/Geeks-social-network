import React, {useEffect, useRef, useState, KeyboardEvent } from 'react';
import {Field, Form, Formik} from "formik";
import "./openai.css"
import {useDispatch, useSelector} from "react-redux";
import {MessagesResponseAiType, OpenAiAction, OpenAiTypes, postMessageToAiThunk} from "./OpenAiReducer";
import {RootState} from "../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import {TypingEffect} from "./typing-effect";

const AskOpenAi = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const {userInput}: OpenAiTypes = useSelector((state: RootState) => state.openAiPage)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        return () => {
            dispatch(OpenAiAction.clearMessagesAC());
        };
    }, []);
    const sendMessageOpenAi =  async () => {
        setIsLoading(true)
        await dispatch(postMessageToAiThunk("user", userInput))
        setIsLoading(false)
        dispatch(OpenAiAction.inputValueSentAC(''))
    }
    const handleSubmit = async () => {
        await sendMessageOpenAi
    }
    const handleKeyDown = (event : KeyboardEvent<HTMLImageElement>) => {
        if (event.keyCode === 13 ) {
            sendMessageOpenAi()
        }
    }
    return (
        <div className="container">
            <h2 className="title">CHAT BOT OPEN AI</h2>
            <OpenAiResponse
                isLoading={isLoading}
            />

            <br/>
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                <Form>
                    <div className="inner_conainer">
                        <Field
                            onKeyDown={handleKeyDown}
                            className="input-textarea"
                            component="textarea"
                            value={userInput}
                            onChange={(event:  React.ChangeEvent<HTMLInputElement>) => dispatch(OpenAiAction.inputValueSentAC(event.target.value))}
                        />
                        <button  className="submit-button" type="submit">
                            Submit
                        </button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};
type OpenAiResponseProps = {
    isLoading : boolean
}
const OpenAiResponse = ({isLoading} : OpenAiResponseProps) => {
    const welcomeTextAi: string = TypingEffect('Hey developer, I am your personal AI. I am here and ready for any questions you may have. Lets engage in a conversation!', 40)
    // const aiResponseText: string = TypingEffect(props.chatBotResponse, 20)
    const {messages}: OpenAiTypes = useSelector((state: RootState) => state.openAiPage)
    const onScrollDownRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (onScrollDownRef.current) {
            onScrollDownRef.current.scrollTop = onScrollDownRef.current.scrollHeight;
        }
    },[messages])

    const messagesJSX = messages.map((item: MessagesResponseAiType) => (
        <div style={{ padding: "10px" }}>
            {item.role === "user" ? (
                <div style={{ color: "red" }}> {item.role} : {item.content} </div>
            ) : (
                <div> {item.role} : {item.content} </div>
            )}
        </div>
    ))
    return (
        <div ref={onScrollDownRef} className="response-container" style={{overflowY: "auto"}}>

            {isLoading ? (
                <div>{messagesJSX}</div>
            ) : messages.length > 0 ? (
                <div>{messagesJSX}</div>
            ) : (
                <div>{welcomeTextAi}</div>
            )}

        </div>
    )
}

export default AskOpenAi;

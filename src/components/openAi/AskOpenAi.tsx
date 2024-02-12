import React, {useEffect, useRef, useState, KeyboardEvent} from 'react';
import {Field, Form, Formik} from "formik";
import "../../css/open_ai/openai-flood-chat.css"
import {useDispatch, useSelector} from "react-redux";
import {MessagesResponseAiType, OpenAiAction, OpenAiTypes, postMessageToAiThunk} from "../../redux/OpenAiReducer";
import {RootState} from "../../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import {compose} from "redux";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import sendBtn from "../../assets/images/icons/send.png"
import {TypingEffects} from "./typing-effect";

const AskOpenAi = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const {userInput}: OpenAiTypes = useSelector((state: RootState) => state.openAiPage)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        return () => {
            dispatch(OpenAiAction.clearMessagesAC());
        };
    }, []);
    const sendMessageOpenAi = async () => {
        setIsLoading(true)
        await dispatch(postMessageToAiThunk("user", userInput))
        setIsLoading(false)
        dispatch(OpenAiAction.inputValueSentAC(''))
    }
    const handleSubmit = async () => {
        await sendMessageOpenAi()
    }
    const handleKeyDown = (event: KeyboardEvent<HTMLImageElement>) => {
        if (event.keyCode === 13) {
            sendMessageOpenAi()
        }
    }
    return (
        <div className="open_ai_container">
            <div className="openai_section">
                <div className="title">
                    <h1>CHAT BOT OPEN AI</h1>
                </div>

                <OpenAiResponse
                    isLoading={isLoading}
                />

                <div className="openai_inner_section">
                    <Formik initialValues={{}} onSubmit={handleSubmit}>
                        <Form>
                            <div className="input-container">
                                <Field
                                    onKeyDown={handleKeyDown}
                                    component="textarea"
                                    value={userInput}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch(OpenAiAction.inputValueSentAC(event.target.value))}
                                />
                                <button className="submit-button" type="submit">
                                    <img src={sendBtn} alt=""/>
                                    {/*Submit*/}
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    );
};

type OpenAiResponseProps = {
    isLoading: boolean
}
const OpenAiResponse = ({isLoading}: OpenAiResponseProps) => {
    const {messages}: OpenAiTypes = useSelector((state: RootState) => state.openAiPage)
    const onScrollDownRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (onScrollDownRef.current) {
            onScrollDownRef.current.scrollTop = onScrollDownRef.current.scrollHeight;
        }
    }, [messages])

    const messagesJSX = messages.map((item: MessagesResponseAiType) => (
        <div style={{padding: "10px"}}>
            {item.role === "user" ? (
                <div style={{color: "red"}}> {item.role} :  {item.content} </div>
            ) : (
                <div> {item.role} :
                    {/*{item.content}*/}
                    <TypingEffects text={item.content} speed={40} />
                </div>
            )}
        </div>
    ))
    console.log('messages' ,messages)
    return (
        <div ref={onScrollDownRef} className="response_section" style={{overflowY: "auto"}}>
            {isLoading ? (
                <div>{messagesJSX}</div>
            ) : messages.length > 0 ? (
                <div>{messagesJSX}</div>
            ) : (
                <TypingEffects text={'Hey developer, I am your personal AI. I am here and ready for any questions you may have. Lets engage in a conversation!'} speed={40} />
            )}
        </div>
    )
}


const AskOpenAiMemoComponent = React.memo(AskOpenAi)
export default compose(
    WithAuthRedirect
)(AskOpenAiMemoComponent)




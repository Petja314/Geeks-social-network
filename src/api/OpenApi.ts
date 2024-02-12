import axios from "axios";
import {OpenAI} from "openai";
import {MessagesResponseAiType} from "../redux/OpenAiReducer";

const apikey = process.env.REACT_APP_API_KEY_OPEN_AI
const BASE_URL = "https://api.openai.com/v1/chat/completions"

const openai = new OpenAI({
    apiKey: apikey,
    dangerouslyAllowBrowser: true
})
export const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openai.apiKey}`
    },
})

export let openAiCall = {
    AiPost(messages: MessagesResponseAiType) {
        return instance.post<openAiResponseType>('', JSON.stringify({"model": "gpt-3.5-turbo", messages}))
    }
}

type ChatChoices = {
    index: number,
    message: {
        role: string,
        content: string
    },
    logprobs: null,
    finish_reason: string
}

type openAiResponseType = {
    choices: ChatChoices[]
}
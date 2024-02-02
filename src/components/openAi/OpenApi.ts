import axios from "axios";
import {OpenAI} from "openai";
const apikey  = process.env.REACT_APP_API_KEY_OPEN_AI
if (!apikey) {
    throw new Error('API KEY IS NOT CORRECT')
}

const BASE_URL = "https://api.openai.com/v1/chat/completions"
const body = {
    "model": "gpt-3.5-turbo",
}

const openai = new OpenAI({
    apiKey : apikey,
    dangerouslyAllowBrowser: true
})
export const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openai.apiKey}`
    },
})

//prompt is userInput question , the reason of prompt variable is because API requeried that naming !
export let openAiCall = {
    AiPost(messages : any) {
        return instance.post('',JSON.stringify({ "model": "gpt-3.5-turbo", messages }))
    }

}
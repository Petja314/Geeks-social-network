import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY

export const instance = axios.create({
    withCredentials: true,
    baseURL: "https://social-network.samuraijs.com/api/1.0/",
    headers: {
        "API-KEY": apiKey
    }
})


export enum ResultCodesEnum {
    Success = 0,
    Error = 1,
}
export enum ResultCodeForCaptcha  {
    CaptchaIsRequired = 10
}


//Generic type
export type ResponseType<D = {}, RC = ResultCodesEnum | ResultCodeForCaptcha> = {
    data: D
    messages: Array<string>
    resultCode: RC
}

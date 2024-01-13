import axios from "axios";

export const instance = axios.create({
    withCredentials: true,
    baseURL: "https://social-network.samuraijs.com/api/1.0/",
    headers: {
        "API-KEY": "c2bdf532-d7f6-470e-a2a0-49c219c0c604"
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
import {instance, ResponseType} from "./Api";

export const authAPI = {
    me() {
        return instance.get<ResponseType<AuthMeType>>('auth/me')
    },
    login(email: string, password: string, rememberMe: boolean, captcha: null | string = null) {
        return instance.post<ResponseType<AuthLoginType>>('auth/login', {email, password, rememberMe, captcha})
    },
    logout() {
        return instance.delete('auth/login')
    },
    captcha() {
        return instance.get<AuthCaptchaType>('/security/get-captcha-url')
    }
}

type AuthMeType = {
        id: number,
        email: string,
        login: string
}
type AuthLoginType = {
        userId: number
}
type AuthCaptchaType = {
    url : string
}



// type AuthMeType = {
//     resultCode: ResultCodesEnum | ResultCodeForCaptcha,
//     messages: Array<string>,
//     data: {
//         id: number,
//         email: string,
//         login: string
//     }
// }
// type AuthLoginType = {
//     resultCode: ResultCodesEnum | ResultCodeForCaptcha
//     messages: Array<string>,
//     data: {
//         userId: number
//     }
// }
// type AuthLogoutType = {
//     resultCode: ResultCodesEnum,
//     messages: Array<string>,
//     data: {}
// }
// type AuthCaptchaType = {
//     url : string
// }
import {ProfileDataType} from "../components/redux/ProfileReducer";
import {instance, ResponseType, ResultCodesEnum} from "./Api";

export const profileAPI = {
    profileAuth(userId: number) {
        return instance.get<ProfileDataType>(`profile/` + userId)
    },
    getStatus(userId: number) {
        return instance.get<string>('profile/status/' + userId)
    },
    updateStatus(status: string) {
        return instance.put<ResponseType>('profile/status/', {status: status})
    },
    savePhoto(photoFile: any) {
        let formData = new FormData()
        formData.append("image", photoFile)
        return instance.put<ResponseType<PhotosType>>('profile/photo/', formData
        )
    },
    saveProfile(profile: ProfileDataType) {
        return instance.put<ResponseType>('profile', profile)
    }
}

export type PhotosType = {
        photos: string
}

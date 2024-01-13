import {instance, ResponseType} from "./Api";
import {AxiosPromise} from "axios";



export const usersAPI = {
    getUsers(currentPage: number, pagesize: number, term : string,friend : null | boolean = null) {
        return instance.get<GetUsersApiType>(`users?page=${currentPage}&count=${pagesize}&term=${term}` + (friend === null? '' : `&friend=${friend}`))
    },
    unFollowUser(id: number) {
        return instance.delete(`follow/${id}`) as AxiosPromise<ResponseType>
    },
    followUser(id: number) {
        return instance.post<ResponseType>(`follow/${id}`)
    }
}



 type GetUsersApiType = {
    items: UsersArrayType[],
    pageSize: number,
     totalCount: number,
    currentPage: number,
    isFetching: boolean,
    followingInProgress: []

}
 type UsersArrayType = {
    "name": string,
    "id": number,
    "uniqueUrlName": boolean,
    "photos": {
        "small": string,
        "large": string
    },
    "status": string,
    "followed": boolean
}
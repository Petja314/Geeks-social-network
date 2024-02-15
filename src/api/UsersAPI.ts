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
    },
    // https://social-network.samuraijs.com/api/1.0/users?friend=true
    getFriends(currentPage : any, friend: any) {
        return instance.get<any>(`users?page=${currentPage}&friend=${friend}`)
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
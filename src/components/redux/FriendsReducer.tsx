import {FilterType} from "./UsersReducer";
import {usersAPI} from "../../api/UsersAPI";
import {actionsMyPosts} from "./MyPostsReducer";

export type FriendsListStateType = {
    friends : any,
    totalCount : any,
    currentPage: any,
    pageSize: any,
}
const initialState : FriendsListStateType = {
    friends : [],
    totalCount : 0,
    currentPage: 1,
    pageSize: 10,
}
export const FriendsReducer = (state = initialState , action : any) : any => {
    switch(action.type) {
        case  "FRIEND_LIST" :
        return  {
            ...state,
            friends : action.friend
        }
        case  "SET_TOTAL_COUNT_FRIENDS" :
        return  {
            ...state,
            totalCount : action.totalCount
        }
        case 'CHANGE_PAGE' :
            return {
                ...state,
                currentPage: action.pageNumber
            }
        case 'UNFOLLOW' :
            return {
                ...state,
                friends: state.friends.map((item : any) => {
                    if (item.id === action.userID) {
                        return {...item, followed: false}
                    }
                    return item
                })
            }
        default : return state
    }
}


export const setFriendListAC = (friend: any) => ({
    type: 'FRIEND_LIST',
    friend
} as const)
export const setFriendsTotalCount = (totalCount: any) => ({
    type: 'SET_TOTAL_COUNT_FRIENDS',
    totalCount
} as const)
export const changePageAC = (pageNumber: number) => ({
    type: 'CHANGE_PAGE',
    pageNumber: pageNumber
} as const)

export const unfollowFriendAC = (userID: number) => ({
    type: 'UNFOLLOW',
    pageNumber: userID
} as const)



export const setFriendListThunkCreator = (currentPage : any, friend : any) => { return async (dispatch : any) => {
    // debugger
    const response =  await usersAPI.getFriends(currentPage, friend)
    dispatch(setFriendListAC(response.data.items))
    dispatch(setFriendsTotalCount(response.data.totalCount))
    dispatch(changePageAC(currentPage))

}
}


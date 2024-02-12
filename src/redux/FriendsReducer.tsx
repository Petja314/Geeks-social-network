import {usersAPI} from "../api/UsersAPI";
import {InferActionsTypes, RootState} from "./Redux-Store";
import {ThunkAction} from "redux-thunk";
import {ResultCodesEnum} from "../api/Api";
import {actionsUsers} from "./UsersReducer";

export type FriendsType = {
    name: string,
    id: number,
    uniqueUrlName: null,
    photos: {
        small: null,
        large: null
    },
    status: null,
    followed: boolean
}

export type FriendsListStateType = {
    friends: FriendsType[]
    totalCount: number,
    currentPage: number,
    pageSize: number,
}
const initialState: FriendsListStateType = {
    friends: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
}
export const FriendsReducer = (state = initialState, action: ActionsTypes): FriendsListStateType => {
    switch (action.type) {
        case  "FRIEND_LIST" :
            return {
                ...state,
                friends: action.friend
            }
        case  "SET_TOTAL_COUNT_FRIENDS" :
            return {
                ...state,
                totalCount: action.totalCount
            }
        case 'CHANGE_PAGE' :
            return {
                ...state,
                currentPage: action.pageNumber
            }
        case 'UNFOLLOW':
            const updatedFriends = state.friends.map((item: any) => {
                if (item.id === action.userID) {
                    return {...item, followed: false};
                }
                return item;
            });
            return {
                ...state,
                friends : updatedFriends
            }
        default :
            return state
    }
}

type ActionsTypes = InferActionsTypes<typeof actionsFriends>

export const actionsFriends = {
    setFriendListAC: (friend: FriendsType[]) => ({
        type: 'FRIEND_LIST',
        friend
    } as const),
    setFriendsTotalCount: (totalCount: number) => ({
        type: 'SET_TOTAL_COUNT_FRIENDS',
        totalCount
    } as const),
    changePageAC: (pageNumber: number) => ({
        type: 'CHANGE_PAGE',
        pageNumber: pageNumber
    } as const),
    unfollowFriendAC: (userID: number) => ({
        type: 'UNFOLLOW',
        userID: userID
    } as const)
}


type ThunkResult<R> = ThunkAction<R, RootState, unknown, ActionsTypes>;

export const setFriendListThunkCreator = (currentPage: number, friend: boolean): ThunkResult<void> => {
    return async (dispatch) => {
        const response = await usersAPI.getFriends(currentPage, friend)
        console.log('response' ,response.data.items  )
        dispatch(actionsFriends.setFriendListAC(response.data.items))
        dispatch(actionsFriends.setFriendsTotalCount(response.data.totalCount))
        dispatch(actionsFriends.changePageAC(currentPage))
    }
}


export const unfollowFriendThunkCreator = (id: number, currentPage: number): ThunkResult<void> => {
    return async (dispatch, getState) => {
        let response = await usersAPI.unFollowUser(id);
        if (response.data.resultCode === ResultCodesEnum.Success) {
            dispatch(actionsFriends.unfollowFriendAC(id));
            // Checking if the friends list is empty on the current page
            const isCurrentPageEmpty = getState().friendPage.friends.every((item: any) => !item.followed);
            // If the current page is empty, decrement the current page by 1
            if (isCurrentPageEmpty) {
                dispatch(actionsFriends.changePageAC(Math.max(1, currentPage - 1)));
            }
            else {
                 dispatch(setFriendListThunkCreator(currentPage, true)); // TO MAKE THE FRIENDS STATE RENDER
            }
        }
    };
};
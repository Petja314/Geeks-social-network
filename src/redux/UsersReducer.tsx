import React from 'react';
import {ResultCodesEnum} from "../api/Api";
import {ThunkAction} from "redux-thunk";
import {InferActionsTypes, RootState} from "./Redux-Store";
import {usersAPI} from "../api/UsersAPI";
import {actionsFriends, setFriendListThunkCreator} from "./FriendsReducer";
import {AxiosResponse} from "axios";
import _ from "lodash";

export type  UsersComponentTypeArrays = {
    users: UsersArrayType[],
    pageSize: number,
    totalUsersCount: number,
    currentPage: number,
    isFetching: boolean,
    followingInProgress: [],
    filter: {
        term: string,
        friend: null | boolean
    },

}
export type UsersArrayType = {
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


const initialState: UsersComponentTypeArrays = {
    users: [],
    pageSize: 10,
    totalUsersCount: 0,
    currentPage: 1,
    isFetching: true,
    followingInProgress: [],
    filter: {
        term: "",
        friend: null as null | boolean
    },
}
export type FilterType = typeof initialState.filter

export type FormType = {
    term: string
    friend: "true" | "false" | "null" | string
}

export const UsersReducer = (state = initialState, action: ActionsTypes): UsersComponentTypeArrays => {
    switch (action.type) {
        case 'FOLLOW':
            return {
                ...state,
                users: state.users.map(item => {
                    if (item.id === action.userID) {
                        return {...item, followed: true}
                    }
                    return item
                })
            }
        case 'UNFOLLOW' :
            return {
                ...state,
                users: state.users.map(item => {
                    if (item.id === action.userID) {
                        return {...item, followed: false}
                    }
                    return item
                })
            }
        case 'SET_USERS' :
            return  {
                ...state,
                users : action.users
            }
        case 'SET_USERS_MOBILE' :
            let newUsers = [...state.users, ...action.mobileUsers];
            return {
                ...state,
                users: newUsers,
                // currentPage : state.currentPage+1
            };

        case 'CURRENT_PAGE' :
            return {...state, currentPage: action.currentPage}
        case 'TOTAL_USERS_COUNTS' :
            return {...state, totalUsersCount: action.totalCount}
        case 'TOGGLE_IS_FETCHING' :
            return {...state, isFetching: action.isFetching}
        case 'TOGGLE_IS_FOLLOWING_PROGRESS' :
            return {
                ...state,
                followingInProgress: action.isFetching
                    ? [...state.followingInProgress, action.userID]
                    : state.followingInProgress.filter(id => id != action.userID)
            } as UsersComponentTypeArrays
        case 'SET_FILTER' :
            return {
                ...state,
                filter: action.payload,
            }

        default:
            return state;
    }
};

//ACTION CREATORS - AC

type ActionsTypes = InferActionsTypes<typeof actionsUsers>

export const actionsUsers = {
    follow: (userID: number) => ({
        type: 'FOLLOW',
        userID: userID
    } as const),
    unfollow: (userID: number) => ({
        type: 'UNFOLLOW',
        userID: userID
    } as const),
    setUsers: (users: UsersArrayType[]) => ({
        type: 'SET_USERS',
        users: users
    } as const),
    setMobileUsers: (mobileUsers: UsersArrayType[]) => ({
        type: 'SET_USERS_MOBILE',
        mobileUsers: mobileUsers,
    } as const),
    setCurrentPage: (currentPage: number) => ({
        type: 'CURRENT_PAGE',
        currentPage: currentPage
    } as const),
    setTotalUsersCount: (totalCount: number) => ({
        type: 'TOTAL_USERS_COUNTS',
        totalCount: totalCount
    } as const),
    setToggleFetching: (isFetching: boolean) => ({
        type: 'TOGGLE_IS_FETCHING',
        isFetching: isFetching
    } as const),
    setFollowingProgress: (isFetching: boolean, userID: number) => ({
        type: 'TOGGLE_IS_FOLLOWING_PROGRESS',
        isFetching,
        userID
    } as const),
    setFilter: (filter: FilterType) => ({
        type: 'SET_FILTER',
        payload: filter
    } as const),
}

type ThunkResult<R> = ThunkAction<R, RootState, unknown, ActionsTypes>;

//Throttle to 2 request per second to avoid error from the server (too many requests 429)
let getUsersThrottled = _.throttle(usersAPI.getUsers,1000)
export const getUsersThunkCreator = (currentPage: number, pageSize: number, filter: FilterType ): ThunkResult<void> => {
    return async (dispatch) => {
        console.log('render')
        dispatch(actionsUsers.setToggleFetching(true));
        dispatch(actionsUsers.setFilter(filter));
            const response : any = await getUsersThrottled(currentPage, pageSize, filter.term, filter.friend);
            dispatch(actionsUsers.setToggleFetching(false));
            //checking is the response data for undefined - to prevent the type error!

         dispatch(actionsUsers.setUsers(response.data.items ));
        dispatch(actionsUsers.setTotalUsersCount(response.data.totalCount));
        dispatch(actionsUsers.setCurrentPage(currentPage));
    };
};

export const getMobileUsersThunkCreator = (currentPage: number, pageSize: number, filter: FilterType )  => {
    return async (dispatch : any) => {
        // console.log('render')
        const response = await usersAPI.getUsers(currentPage, pageSize, filter.term, filter.friend);
            dispatch(actionsUsers.setMobileUsers(response.data.items))
    }}

export const unfollowUserThunkCreator = (id: number): ThunkResult<void> => {
    return async (dispatch) => {
        dispatch(actionsUsers.setFollowingProgress(true, id))
        let response = await usersAPI.unFollowUser(id)
        if (response.data.resultCode === ResultCodesEnum.Success) {
            dispatch(actionsUsers.unfollow(id))
        }
        dispatch(actionsUsers.setFollowingProgress(false, id))
    }
}

export const followUserThunkCreator = (id: number): ThunkResult<void> => {
    return async (dispatch) => {
        dispatch(actionsUsers.setFollowingProgress(true, id))
        let response = await usersAPI.followUser(id)
        if (response.data.resultCode === ResultCodesEnum.Success) {
            dispatch(actionsUsers.follow(id))
        }
        dispatch(actionsUsers.setFollowingProgress(false, id))
    }
}

export default UsersReducer


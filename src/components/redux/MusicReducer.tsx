import React, {useState} from 'react';

export interface ActionTypeToProps {
    type: string,
    payload?: any,
    userId? : any
}

export interface StatePropsType {
    posts: PostsArrMusicType[],
    usersTotalCount: number,
    currentPage: number,
    postsPerPage: number,
    isFetching: boolean,
    users : PostsArrMusicType[]

}

export type PostsArrMusicType = {
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

const initialState = {
    posts: [],
    usersTotalCount: 0,
    currentPage: 1,
    postsPerPage: 5,
    isFetching: true,
    users : []
}
export const MusicReducer = (state: StatePropsType = initialState, action: ActionTypeToProps) => {
    // console.log(state)
    switch (action.type) {
        case "SET_POSTS" :
            return {...state, posts: action.payload}
        case "SET_USERS_TOTAL_COUNT" :
            return {...state, usersTotalCount: action.payload}
        case "SET_CURRENT_PAGE" :
            return {...state, currentPage: action.payload}
        case "TOGGLE_IS_FETCHING" :
            return {...state, isFetching: action.payload}
        case "FOLLOW" :
                return {
                    ...state,
                    users : state.users.map(u => {
                        if ( u.id === action.payload) {
                            return {...u,followed : true}
                        }
                        return u
                    })
                }

        case "UNFOLLOW" :
            return {
                ...state,
                users : state.users.map(u => {
                    if ( u.id === action.payload) {
                        return {...u,followed : false}
                    }
                    return u
                })
            }
        default :
            return state
    }
};
export const setPostsAC = (value: any) => {
    return {
        type: "SET_POSTS",
        payload: value
    }
}

export const setUsersTotalCountAC = (value: any) => {
    return {
        type: "SET_USERS_TOTAL_COUNT",
        payload: value
    }
}
export const setCurrentPageAC = (value: any) => {
    return {
        type: "SET_CURRENT_PAGE",
        payload: value
    }
}
export const setToggleFetchingAC = (value: boolean) => {
    return {
        type: "TOGGLE_IS_FETCHING",
        payload: value
    }
}


export const setFollowAC = (userId : any) => {
    console.log(userId)

    return {
        type : "FOLLOW",
        userId
    }
}
export const setUnFollowAC = (userId : any) => {
    console.log(userId)
    return {
        type : "UNFOLLOW",
        userId
    }
}



import React from 'react';
import {ResultCodesEnum} from "../../api/Api";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {InferActionsTypes, RootState} from "./Redux-Store";
import {profileAPI} from "../../api/ProfileAPI";
import {Action, AnyAction} from "redux";

export type ProfileDataType  = {
    "aboutMe": string,
    "contacts": ContactsType,
    "lookingForAJob": true,
    "lookingForAJobDescription": string,
    "fullName": string,
    "userId": number,
    "photos": {
        "small": string | null,
        "large": string | null
    }
}
export type ContactsType = {
    facebook: string;
    website: null | string;
    vk: string;
    twitter: string;
    instagram: string;
    youtube: null | string;
    github: string;
    mainLink: null | string;
};
export type ProfileStateTypes = {
    profile?: ProfileDataType;
    status?: string
}
let initialState: ProfileStateTypes = {}


export const ProfileReducer = (state  = initialState, action: ActionsProfileTypes) => {
    switch (action.type) {
        case 'SET_USER_PROFILE' :
                return {...state, profile: action.profile}
        case 'SET_STATUS' :
                return {...state, status: action.status}
        case 'SAVE_PHOTO_SUCCESS' :
                return {...state ,profile : {...state.profile , photos : action.photos}}
        default:
            return state;
    }
};

//Actions type for the profile reducer
type ActionsProfileTypes = InferActionsTypes<typeof actions>
//Actions for the profile reducer
export const actions = {
     setUserProfileAction : (profile: ProfileDataType) => ({
            type: 'SET_USER_PROFILE',
            profile: profile
    }as const),
     setStatusAction : (status: string) => ({
            type: 'SET_STATUS',
            status: status
    }as const),
     savePhotoSuccess : (photos : string)  => ({
            type : 'SAVE_PHOTO_SUCCESS',
            photos : photos
    }as const)
}

// Thunk type for the profile reducer
type ThunkType = ThunkAction<Promise<void>, ProfileStateTypes  , unknown, ActionsProfileTypes | any >
    // | ReturnType <typeof stopSubmit>>


// Thunk to fetch user profile data
export const usersProfileAuthThunkCreator = (userId: number) : any => async (dispatch : any ) => {
        let response = await profileAPI.profileAuth(userId)
                dispatch(actions.setUserProfileAction(response.data));
}

// Thunk to fetch user status
export const getStatusThunkCreator = (userID: number)  : any  => async  (dispatch : any ) => {
   let response = await profileAPI.getStatus(userID)
            dispatch(actions.setStatusAction(response.data))
}

// Thunk to update user status
export const updateStatusThunkCreator = (status: string) : ThunkType=> async  (dispatch) => {
    let response = await profileAPI.updateStatus(status)
            if (response.data.resultCode === ResultCodesEnum.Error) {
                let errorMessage = response.data.messages[0]
                debugger
                dispatch(actions.setStatusAction(errorMessage))
            }
}

// Thunk to save user photo
export const savePhotoThunk = (file : File) : ThunkType => async (dispatch ) => {
    let response = await profileAPI.savePhoto(file)
    if (response.data.resultCode === ResultCodesEnum.Success) {
        dispatch(actions.savePhotoSuccess(response.data.data.photos))
    }
}

// Thunk to save user profile
export const saveProfileThunk = (profile: ProfileDataType): ThunkType => async (dispatch, getState: any) => {
    const userId = getState().userAuthPage.id;
    try {
        let response = await profileAPI.saveProfile(profile);
        if (response.data.resultCode === ResultCodesEnum.Success) {
            if (userId != null) {
                await dispatch(usersProfileAuthThunkCreator(userId));
            } else {
                // Handle the case where userId is null
                console.error("User ID is null.");
            }
        } else {
            // Set the form-wide error message
            throw new Error(response.data.messages[0] || "Some error occurred.");
        }
    } catch (error) {
        // Handle other errors (e.g., network issues)
        console.error("An error occurred. Please try again.");
        throw error; // Re-throw the error to be caught by the Formik submitError
    }
};

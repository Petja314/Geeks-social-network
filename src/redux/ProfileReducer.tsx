import React from 'react';
import {ResultCodesEnum} from "../api/Api";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {InferActionsTypes, RootState} from "./Redux-Store";
import {profileAPI} from "../api/ProfileAPI";
import {Action, AnyAction} from "redux";
import {act} from "react-dom/test-utils";
import _ from "lodash";
import {usersAPI} from "../api/UsersAPI";

export type ProfileDataType = {
    aboutMe: string,
    contacts: ContactsType,
    lookingForAJob: true,
    lookingForAJobDescription: string,
    fullName: string,
    userId: number,
    photos: {
        small: string | null,
        large: string | null
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
    profile: ProfileDataType;
    status: string | null,
    error?: { [key: string]: string } | null
}
let initialState: ProfileStateTypes = {
    profile: {
        aboutMe: "",
        contacts: {
            facebook: "",
            website: null || "",
            vk: "",
            twitter: "",
            instagram: "",
            youtube: null || "",
            github: "",
            mainLink: null || "",
        },
        lookingForAJob: true,
        lookingForAJobDescription: "",
        fullName: "",
        userId: 1,
        photos: {
            small: "" || null,
            large: "" || null
        }
    },
    status: "" || null,
    error: "" || null
}

export const ProfileReducer = (state = initialState, action: ActionsProfileTypes) => {
    switch (action.type) {
        case 'SET_USER_PROFILE' :
            return {...state, profile: action.profile}
        case 'SET_STATUS' :
            return {...state, status: action.status}
        case 'SAVE_PHOTO_SUCCESS' :
            return {...state, profile: {...state.profile, photos: action.photos}}
        case 'SET_ERROR' :
            return {...state, error: action.error}
        default:
            return state;
    }
};

//Actions type for the profile reducer
export type ActionsProfileTypes = InferActionsTypes<typeof actionsProfile>
//Actions for the profile reducer
export const actionsProfile = {
    setUserProfileAction: (profile: ProfileDataType) => ({
        type: 'SET_USER_PROFILE',
        profile: profile
    } as const),
    setStatusAction: (status: string | null) => ({
        type: 'SET_STATUS',
        status: status
    } as const),
    savePhotoSuccess: (photos: string) => ({
        type: 'SAVE_PHOTO_SUCCESS',
        photos: photos
    } as const),
    setErrorAction: (error: any) => ({
        type: 'SET_ERROR',
        error: error
    } as const)
}

// Thunk type for the profile reducer
type ThunkType = ThunkAction<Promise<void>, ProfileStateTypes, unknown, ActionsProfileTypes | any>
// | ReturnType <typeof stopSubmit>>


// Thunk to fetch user profile data
export const usersProfileAuthThunkCreator = (userId: number | null): ThunkType => async (dispatch) => {
    let response = await profileAPI.profileAuth(userId)
    dispatch(actionsProfile.setUserProfileAction(response.data));
}

// Thunk to fetch user status
export const getStatusThunkCreator = (userID: number | null): ThunkType => async (dispatch) => {
    let response = await profileAPI.getStatus(userID)
    // if (response.data.resultCode === ResultCodesEnum.Success) {
        dispatch(actionsProfile.setStatusAction(response.data))
    console.log('status ')
    // }
}

// Thunk to update user status
export const updateStatusThunkCreator = (status: string | null): ThunkType => async (dispatch) => {
    let response = await profileAPI.updateStatus(status)
    if (response.data.resultCode === ResultCodesEnum.Error) {
        let errorMessage = response.data.messages[0]
        dispatch(actionsProfile.setStatusAction(errorMessage))
    }
}

// Thunk to save user photo
export const savePhotoThunk = (file: File): ThunkType => async (dispatch) => {
    let response = await profileAPI.savePhoto(file)
    debugger
    if (response.data.resultCode === ResultCodesEnum.Success) {
        dispatch(actionsProfile.savePhotoSuccess(response.data.data.photos))
    }
}

// Thunk to save user profile
type ThunkTypeForBothReducers = ThunkAction<Promise<void>, RootState, unknown, ActionsProfileTypes | any>;
export const saveProfileThunk = (profile: ProfileDataType): ThunkTypeForBothReducers => async (dispatch, getState) => {
    debugger
    const userId = getState().userAuthPage.userId;
    try {
        let response = await profileAPI.saveProfile(profile);
        if (response.data.resultCode === ResultCodesEnum.Success) {
            if (userId != null) {
                await dispatch(usersProfileAuthThunkCreator(userId));
                dispatch(actionsProfile.setErrorAction(null))
            } else {
                // Handle the case where userId is null
                console.error("User ID is null.");
            }
        } else {
            // Set the form-wide error message
            const formattedErrors = response.data.messages
            dispatch(actionsProfile.setErrorAction(formattedErrors))
            throw new Error(response.data.messages[0] || "Some error occurred.");
        }
    } catch (error) {
        // Handle other errors (e.g., network issues)
        console.error("An error occurred. Please try again.");
        throw error; // Re-throw the error to be caught by the Formik submitError
    }
};

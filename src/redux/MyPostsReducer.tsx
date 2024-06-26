import {InferActionsTypes, RootState} from "./Redux-Store";
import {ThunkAction} from "redux-thunk";

export type ResponseTestAPIDataType = {
    id: number,
    userId?: number | null,
    idUserURL?: number | null,
    title: string,
    content: string,
    likes: number,
    image: string
}
export type MyPostsInitialState = {
    posts: Array<ResponseTestAPIDataType>,
    userId: number | null,
    idUserURL: number | null,
    currentPage: number,
    pageSize: number,
}
let initialState: MyPostsInitialState = {
    posts: [],
    userId: null,
    idUserURL: null,
    currentPage: 1,
    pageSize: 5,
}

export const MyPostsReducer = (state = initialState, action: ActionsTypes): MyPostsInitialState => {
    switch (action.type) {
        case 'SET_USER_ID' :
            return {
                ...state,
                userId: action.userId
            }
        case 'SET_UNVERIFIED_USER_ID' :
            return {
                ...state,
                idUserURL: action.idUserURL
            }
        case 'SET_POSTS_DATABASE' :
            return {
                ...state,
                posts: action.postData
            }
        case 'SET_NEW_POST' :
            const newStateLS = {
                ...state,
                posts: [...state.posts, action.newPost]
            };
            // Update local storage
            localStorage.setItem('adminPosts', JSON.stringify(newStateLS.posts));

            return newStateLS;
        case 'DELETE_POST' :
            const deletePostLS = {
                ...state,
                posts: action.deletePost
            }
            localStorage.setItem('adminPosts', JSON.stringify(deletePostLS.posts));
            return deletePostLS
        case 'ADD_LIKE' :
            const addLikeLS = {
                ...state,
                posts: action.addLike
            }
            localStorage.setItem('adminPosts', JSON.stringify(addLikeLS.posts));
            return addLikeLS
        case 'DELETE_ALL_POSTS' :
            const deleteAllPostsLS =  {
                ...state,
                posts: []
            }
            localStorage.setItem('adminPosts', JSON.stringify(deleteAllPostsLS.posts));
            return deleteAllPostsLS
        case 'SAVE_POST' :
            const savePostLS =  {
                ...state,
                posts: action.updateEditedPost
            }
            localStorage.setItem('adminPosts', JSON.stringify(savePostLS.posts));
            return savePostLS
        case 'CHANGE_PAGE' :
            return {
                ...state,
                currentPage: action.pageNumber
            }

        default:
            return state;
    }
};

type ActionsTypes = InferActionsTypes<typeof actionsMyPosts>
export const actionsMyPosts = {
    setUserIdAC: (userId: number | null) => ({
        type: 'SET_USER_ID',
        userId: userId
    } as const),
    setUnverifiedUserID: (idUserURL: number | null) => ({
        type: 'SET_UNVERIFIED_USER_ID',
        idUserURL: idUserURL
    } as const),
    setPostsDataBaseAC: (postData: Array<ResponseTestAPIDataType>) => ({
        type: 'SET_POSTS_DATABASE',
        postData: postData,
    } as const),
    newPostAC: (newPost: ResponseTestAPIDataType) => ({
        type: 'SET_NEW_POST',
        newPost: newPost,
    } as const),
    deletePostAC: (deletePost: Array<ResponseTestAPIDataType>) => ({
        type: 'DELETE_POST',
        deletePost: deletePost,
    } as const),
    addLikeToPostAC: (addLike: Array<ResponseTestAPIDataType>) => ({
        type: 'ADD_LIKE',
        addLike: addLike,
    } as const),
    deleteAllPostsAC: () => ({
        type: 'DELETE_ALL_POSTS',
    } as const),
    savePostAC: (updateEditedPost: Array<ResponseTestAPIDataType>) => ({
        type: 'SAVE_POST',
        updateEditedPost: updateEditedPost
    } as const),
    changePageAC: (pageNumber: number) => ({
        type: 'CHANGE_PAGE',
        pageNumber: pageNumber
    } as const),
}


type ThunkResult<R> = ThunkAction<R, RootState, unknown, ActionsTypes>;


export const setUserIdThunk = (userId: number | null): ThunkResult<void> => {
    return (dispatch) => {
        // debugger
        dispatch(actionsMyPosts.setUserIdAC(userId))
    }
}
export const setUnverifiedUserIDThunk = (idUserURL: number | null): ThunkResult<void> => {
    return (dispatch) => {
        // debugger
        dispatch(actionsMyPosts.setUnverifiedUserID(idUserURL))
    }
}
export const fetchPostsThunk = (postData: Array<ResponseTestAPIDataType>): ThunkResult<void> => {
    return (dispatch) => {
        if(postData.length <= 0){
            return;
        }
        dispatch(actionsMyPosts.setPostsDataBaseAC(postData))

        if( postData[0].userId !== 29260 ) {
            localStorage.setItem('usersPosts', JSON.stringify(postData));
        }
        else {
            localStorage.setItem('adminPosts', JSON.stringify(postData));
        }
    }
}
export const createNewPostThunk = (newPost: ResponseTestAPIDataType): ThunkResult<void> => {
    return (dispatch) => {
        dispatch(actionsMyPosts.newPostAC(newPost))
    }
}

export const savePostThunk = (updateEditedPost: Array<ResponseTestAPIDataType>): ThunkResult<void> => {
    return (dispatch) => {
        dispatch(actionsMyPosts.savePostAC(updateEditedPost))
    }
}
export const onPageChangeThunk = (pageNumber: number): ThunkResult<void> => {
    return (dispatch) => {
        dispatch(actionsMyPosts.changePageAC(pageNumber))
    }
}


export default MyPostsReducer


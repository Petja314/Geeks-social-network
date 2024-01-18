import {InferActionsTypes, RootState} from "./Redux-Store";
import {ThunkAction} from "redux-thunk";
export type ResponseTestAPIDataType = {
    id: number,
    userId: number | null,
    title: string,
    content: string,
    likes: number,
    image: string
}
export type MyPostsInitialState = {
    posts : Array<ResponseTestAPIDataType>,
    userId : number | null,
    currentPage : number,
    pageSize : number,
}
let initialState: MyPostsInitialState = {
    posts : [],
    userId : null,
    currentPage : 1,
    pageSize : 5,
}

export const MyPostsReducer = (state = initialState, action: ActionsTypes): MyPostsInitialState => {
    switch (action.type) {
        case 'SET_USER_ID' :
            return {
                ...state,
                userId : action.userId
            }
        case 'SET_POSTS_DATABASE' :
            return {
                ...state,
                posts : action.postData
            }
            case 'SET_NEW_POST' :
            return {
                ...state,
                posts : [...state.posts, action.newPost]
            }
            case 'DELETE_POST' :
            return {
                ...state,
                posts: action.deletePost
            }
                case 'ADD_LIKE' :
                return {
                    ...state,
                    posts : action.addLike
                }
                case 'DELETE_ALL_POSTS' :
                return {
                    ...state,
                    posts : []
                }
                case 'SAVE_POST' :
                return {
                    ...state,
                    posts : action.updateEditedPost
                }
                case 'CHANGE_PAGE' :
                return {
                    ...state,
                    currentPage : action.pageNumber
                }

        default:
            return state;
    }
};

type ActionsTypes = InferActionsTypes<typeof actionsMyPosts>
export const actionsMyPosts= {
    setUserIdAC : (userId : number | null) => ({
        type : 'SET_USER_ID',
        userId : userId
    }as const),
     setPostsDataBaseAC : (postData: Array<ResponseTestAPIDataType>) => ({
            type: 'SET_POSTS_DATABASE',
         postData: postData,
    }as const),
    newPostAC : (newPost: ResponseTestAPIDataType) => ({
        type: 'SET_NEW_POST',
        newPost: newPost,
    }as const),
    deletePostAC : (deletePost:  Array<ResponseTestAPIDataType>) => ({
        type: 'DELETE_POST',
        deletePost: deletePost,
    }as const),
    addLikeToPostAC : (addLike:  Array<ResponseTestAPIDataType>) => ({
        type: 'ADD_LIKE',
        addLike: addLike,
    }as const),
    deleteAllPostsAC : () => ({
        type: 'DELETE_ALL_POSTS',
    }as const),
    savePostAC : (updateEditedPost : Array<ResponseTestAPIDataType>) => ({
        type: 'SAVE_POST',
        updateEditedPost : updateEditedPost
    }as const),
    changePageAC : (pageNumber : number) => ({
        type: 'CHANGE_PAGE',
        pageNumber : pageNumber
    }as const),
}


type ThunkResult<R> = ThunkAction<R, RootState, unknown, ActionsTypes>;


export const setUserIdThunk = (userId: number | null) : ThunkResult<void>  => {
    return  (dispatch) => {
        dispatch(actionsMyPosts.setUserIdAC(userId))
    }
}
export const fetchPostsThunk = (postData : Array<ResponseTestAPIDataType>) : ThunkResult<void>  => {
    return  (dispatch) => {
        dispatch(actionsMyPosts.setPostsDataBaseAC(postData))
    }
}
export const createNewPostThunk = (newPost : ResponseTestAPIDataType) : ThunkResult<void>  => {
    return  (dispatch) => {
        dispatch(actionsMyPosts.newPostAC(newPost))
    }
}

export const savePostThunk = (updateEditedPost : Array<ResponseTestAPIDataType>) : ThunkResult<void>  => {
    return  (dispatch) => {
        dispatch(actionsMyPosts.savePostAC(updateEditedPost))
    }
}
export const onPageChangeThunk = (pageNumber : number) : ThunkResult<void>  => {
    return  (dispatch) => {
        dispatch(actionsMyPosts.changePageAC(pageNumber))
    }
}


export default MyPostsReducer


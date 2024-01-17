import { InferActionsTypes } from "../../redux/Redux-Store";

export type MyPostsInitialState = {
    posts : any,
    userId : any,
    currentPage : any,
    pageSize : any,
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
                    // posts : [...state.posts.map((item: any) => (item.id === action.postId ? {...item, likes: item.likes + 1} : item))]
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
export const actionsMyPosts = {
    setUserIdAC : (userId : any) => ({
        type : 'SET_USER_ID',
        userId : userId
    }as const),
     setPostsDataBaseAC : (postData: any) => ({
            type: 'SET_POSTS_DATABASE',
         postData: postData,
    }as const),
    newPostAC : (newPost: any) => ({
        type: 'SET_NEW_POST',
        newPost: newPost,
    }as const),
    deletePostAC : (deletePost: any) => ({
        type: 'DELETE_POST',
        deletePost: deletePost,
    }as const),
    addLikeToPostAC : (addLike: any) => ({
        type: 'ADD_LIKE',
        addLike: addLike,
    }as const),
    deleteAllPostsAC : () => ({
        type: 'DELETE_ALL_POSTS',
    }as const),
    savePostAC : (updateEditedPost : any) => ({
        type: 'SAVE_POST',
        updateEditedPost : updateEditedPost
    }as const),
    changePageAC : (pageNumber : any) => ({
        type: 'CHANGE_PAGE',
        pageNumber : pageNumber
    }as const),

}



export const setUserIdThunk = (userId : any) : any  => {
    return  (dispatch: any) => {
        dispatch(actionsMyPosts.setUserIdAC(userId))
    }
}
export const fetchPostsThunk = (postData : any) : any  => {
    return  (dispatch: any) => {
        dispatch(actionsMyPosts.setPostsDataBaseAC(postData))
    }
}
export const createNewPostThunk = (newPost : any) : any  => {
    return  (dispatch: any) => {
        dispatch(actionsMyPosts.newPostAC(newPost))
    }
}

export const savePostThunk = (updateEditedPost : any) : any  => {
    return  (dispatch: any) => {
        dispatch(actionsMyPosts.savePostAC(updateEditedPost))
    }
}
export const onPageChangeThunk = (pageNumber : any) : any  => {
    return  (dispatch: any) => {
        dispatch(actionsMyPosts.changePageAC(pageNumber))
    }
}



// type ThunkType = ThunkAction<Promise<void>, AuthState, unknown, ActionsTypes >
// | ReturnType <typeof stopSubmit>>
export default MyPostsReducer


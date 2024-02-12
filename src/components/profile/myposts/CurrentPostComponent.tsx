import React from 'react';
import {actionsMyPosts, onPageChangeThunk, ResponseTestAPIDataType} from "../../../redux/MyPostsReducer";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import "../../../css/news.css"
import "../../../css/posts/current_posts.css"

import thumb_up from "../../../assets/images/icons/thumbup.png"

type CurrentPostPropsType = {
    posts: Array<ResponseTestAPIDataType>
    pageSize: number
    currentPage: number
    setEditPost?: (value: null | ResponseTestAPIDataType) => void
    idUserURL?: number
    currentPosts: Array<ResponseTestAPIDataType>
}
const CurrentPostComponent: React.FC<CurrentPostPropsType> = ({posts, pageSize, currentPage, setEditPost, idUserURL, currentPosts}) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const deletePost = (postId: number) => {
        // debugger
        const updatedPosts = posts.filter((item: ResponseTestAPIDataType) => item.id !== postId);
        dispatch(actionsMyPosts.deletePostAC(updatedPosts));
        // Calculate the total number of pages based on the updated posts array length and page size
        const totalPosts = posts.length - 1; // -1 for the deleted post
        const totalPages = Math.ceil(totalPosts / pageSize);
        // Determine the new current page based on the total number of pages
        const newCurrentPage = Math.min(currentPage, totalPages);
        // Dispatch an action to update the current page in the state
        dispatch(onPageChangeThunk(newCurrentPage));
    };
    const addLike = (postId: number) => {
        let increaseLikes = posts.map((item: ResponseTestAPIDataType) => (item.id === postId ? {...item, likes: item.likes + 1} : item))
        dispatch(actionsMyPosts.addLikeToPostAC(increaseLikes))
    }
    const editPostHandler = (postId: number) => {
        const postToEdit = posts.find((item: ResponseTestAPIDataType) => item.id === postId)
        if (setEditPost) {
            setEditPost(postToEdit || null);
        }
    };

    return (
        <div className="container_all_posts">
                {currentPosts.map((item: ResponseTestAPIDataType, index: number) => (
                    <div key={item.id} className={`current_post_items_${index + 1}`}>

                        <div className="current_posts_container">

                            <div className="current_post_image">
                                <img src={item.image}/>
                            </div>

                            <div className="current_post_content">
                                <div className="post_detail">
                                    <span>POST NUMBER:</span> {item.id}
                                </div>
                                <div className="current_post_detail">
                                    <span>Title:</span> {item.title}
                                </div>
                                <div className="current_post_detail">
                                    <span>Content:</span> {item.content}
                                </div>
                                {/*DO NOT SHOW WHEN IT'S NOT ADMIN PROFILE*/}
                                {!idUserURL &&
                                    <div className="current_post_buttons">
                                        <button onClick={() => addLike(item.id)}><img  style={{width : "20px"}} src={thumb_up} alt="like"/>   {item.likes}</button>
                                        <button onClick={() => deletePost(item.id)}>Delete post</button>
                                        <button onClick={() => editPostHandler(item.id)}>Edit</button>
                                    </div>
                                }
                            </div>
                        </div>

                    </div>
                ))}
        </div>
    )
}


const CurrentPostMemoComponent = React.memo(CurrentPostComponent)
export default CurrentPostMemoComponent
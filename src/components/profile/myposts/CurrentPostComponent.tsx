import React from 'react';
import {actionsMyPosts, onPageChangeThunk, ResponseTestAPIDataType} from "../../redux/MyPostsReducer";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import styles from "./MyPosts.module.css";

type CurrentPostPropsType = {
    item: ResponseTestAPIDataType,
    posts: Array<ResponseTestAPIDataType>
    pageSize: number
    currentPage: number
    setEditPost: (value : null | ResponseTestAPIDataType) => void
}
const CurrentPostComponent: React.FC<CurrentPostPropsType> = ({item, posts, pageSize, currentPage, setEditPost}) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const deletePost = (postId: number) => {
        const updatedPosts = posts.filter((item: any) => item.id !== postId);
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
        let increaseLikes = posts.map((item: any) => (item.id === postId ? {...item, likes: item.likes + 1} : item))
        dispatch(actionsMyPosts.addLikeToPostAC(increaseLikes))
    }
    const editPostHandler = (postId: number) => {
        const postToEdit = posts.find((item: ResponseTestAPIDataType) => item.id === postId)
        setEditPost(postToEdit || null)
    };
    return (
        <div>
            <article>
                <div className={styles.postInfo}>
                    <div className={styles.postDetail}>
                        <span className={styles.label}>Post Id:</span> {item.id}
                    </div>
                    <div className={styles.postDetail}>
                        <span className={styles.label}>Title:</span> {item.title}
                    </div>
                    <div className={styles.postDetail}>
                        <span className={styles.label}>Post content:</span> {item.content}
                    </div>

                    <div>
                        <img className={styles.postImage} src={item.image}/>
                    </div>

                    <div className={styles.postButtons}>
                        <button onClick={() => addLike(item.id)}>Like + {item.likes}</button>
                        <button onClick={() => deletePost(item.id)}>Delete post</button>
                        <button onClick={() => editPostHandler(item.id)}>Edit</button>
                    </div>
                </div>
                <hr/>
            </article>
        </div>
    )
}


const CurrentPostMemoComponent = React.memo(CurrentPostComponent)
export default CurrentPostMemoComponent
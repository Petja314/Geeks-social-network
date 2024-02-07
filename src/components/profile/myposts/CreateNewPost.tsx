import {actionsMyPosts, createNewPostThunk, onPageChangeThunk, ResponseTestAPIDataType} from "../../../redux/MyPostsReducer";
import React from "react";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import styles from "./MyPosts.module.css";

export type CreateNewPostPropsType = {
    newPost: ResponseTestAPIDataType
    setNewPost: (value: ResponseTestAPIDataType) => void
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    posts: Array<ResponseTestAPIDataType>
    userId: number | null
    pageSize: number
}
const CreateNewPost: React.FC<CreateNewPostPropsType> = ({newPost, setNewPost, handleImageChange, posts, userId, pageSize}) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const createPost = () => {
        const newPostId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1
        const updatedPost = {...newPost, id: newPostId}
        dispatch(createNewPostThunk(updatedPost)) //Sending the new post values to update the post[]
        setNewPost({id: 0, userId, title: '', content: '', likes: 0, image: ''})//Clear whe input fields after post was added.

        //SET CURRENT PAGE WHERE IS MY NEW POST
        const totalPosts: number = posts.length + 1; // +1 for the newly added post
        const totalPages: number = Math.ceil(totalPosts / pageSize);
        // Determine the new current page based on the total number of pages
        const newCurrentPage: number = totalPages
        dispatch(onPageChangeThunk(newCurrentPage))

    };
    const deleteAllPosts = () => {
        dispatch(actionsMyPosts.deleteAllPostsAC())
        dispatch(onPageChangeThunk(1));
    }

    let disableSentEmpty: boolean = newPost.title === '' || newPost.content === ''
    return (
        <div>
            {/* Create a new Post */}
            <div className={styles.newPostContainer}>
                <div>
                    <div className={styles.changeTitle} >
                       <h3 className={styles.createPostTitle} >Create new post</h3>
                    <input
                        value={newPost.title}
                        type="text"
                        placeholder="Title"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewPost({...newPost, title: event.currentTarget.value})}
                    />
                        </div>
                </div>

                <div className={styles.changeContent}>
                                    <textarea
                                        value={newPost.content}
                                        placeholder="Type a new post text..."
                                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost({...newPost, content: event.currentTarget.value})}
                                    ></textarea>
                </div>


                <div className={styles.selectImage} >
                    <span className={styles.selectImageTitle} >Select image:</span>
                    <input key={newPost.image} type="file" accept="image/*" onChange={handleImageChange}/>
                </div>
                <div>
                    <img className={styles.postImage} src={newPost.image}/>
                </div>

                <div className={styles.postButtons}>
                    <button disabled={disableSentEmpty} onClick={createPost}>
                        Create a post
                    </button>
                    <button onClick={deleteAllPosts}>Delete all posts</button>
                </div>
            </div>
        </div>
    )
}


const CreateNewPostMemoComponent = React.memo(CreateNewPost)
export default CreateNewPostMemoComponent
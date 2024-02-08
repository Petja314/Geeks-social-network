import {actionsMyPosts, createNewPostThunk, onPageChangeThunk, ResponseTestAPIDataType} from "../../../redux/MyPostsReducer";
import React from "react";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import "../../../css/profile_edit.css"
import "../../../css/posts/create_new_post.css"
import DragPhoto from "../../drag_drop_img/DragPhoto";

export type CreateNewPostPropsType = {
    newPost: ResponseTestAPIDataType
    setNewPost: (value: ResponseTestAPIDataType) => void
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    posts: Array<ResponseTestAPIDataType>
    userId: number | null
    pageSize: number
    onDropHandler: (event: any) => void
}
const CreateNewPost: React.FC<CreateNewPostPropsType> = ({newPost, setNewPost, handleImageChange, posts, userId, pageSize, onDropHandler}) => {
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
            <div className="new_post_container">

                <h3 className="create_post_title">Create new post</h3>


                    <div className="create_new_post_info_section">
                        <input
                            value={newPost.title}
                            type="text"
                            placeholder="Title"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewPost({...newPost, title: event.currentTarget.value})}
                        />
                        <div>
                        <textarea
                            value={newPost.content}
                            placeholder="Type a new post text..."
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost({...newPost, content: event.currentTarget.value})}
                        ></textarea>
                        </div>
                    </div>


                <div className="upload_image_section">
                    <div className="select_image_title">Select image:</div>

                    <img className="post_image" src={newPost.image}/>
                    <div className="photo_input_section">
                        <DragPhoto onDropHandler={onDropHandler}
                        />
                    </div>
                    <input className="custom-file-input" type="file" accept="image/*" onChange={handleImageChange}/>

                    <div className="post_buttons">
                        <button disabled={disableSentEmpty} onClick={createPost}>
                            Create a post
                        </button>
                        <button onClick={deleteAllPosts}>Delete all posts</button>
                    </div>
                </div>


            </div>
        </div>
    )
}


const CreateNewPostMemoComponent = React.memo(CreateNewPost)
export default CreateNewPostMemoComponent
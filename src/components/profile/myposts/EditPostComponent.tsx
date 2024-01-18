import React from 'react';
import {ResponseTestAPIDataType, savePostThunk} from "../../redux/MyPostsReducer";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import styles from "./MyPosts.module.css";


type EditPostPropsType = {
    setEditPost: (value : null | ResponseTestAPIDataType) => void,
    editPost: ResponseTestAPIDataType ,
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    posts: Array<ResponseTestAPIDataType>

}
const EditPostComponent: React.FC<EditPostPropsType> = ({setEditPost, editPost, handleImageChange, posts,}) => {
    const dispatch : ThunkDispatch<RootState, void, any> = useDispatch()
    const saveEditedPost = () => {
        const updateEditedPost = posts.map((item: ResponseTestAPIDataType) => item.id === editPost.id ? editPost : item)
        dispatch(savePostThunk(updateEditedPost))
        setEditPost(null)
    };
    return (
        <div>
            <div className={styles.editMode}>
                {/*EDIT POST SECTION*/}
                <div>
                    <h3>Change title</h3>
                    <input
                        placeholder="Type new title..."
                        type="text"
                        onChange={(event : React.ChangeEvent<HTMLInputElement>) => setEditPost({...editPost, title: event.currentTarget.value})}

                    />
                </div>

                <div className={styles.changeContent}>
                    <div>Change content:</div>
                    <textarea
                        placeholder="Type a new post..."
                        onChange={(event : React.ChangeEvent<HTMLTextAreaElement>) => setEditPost({...editPost, content: event.currentTarget.value})}
                    ></textarea>
                </div>
                <div>
                    <img className={styles.postImage} src={editPost.image}/>
                    <input key={editPost?.image || 'editPost'} type="file" accept="image/*" onChange={handleImageChange}/>
                </div>

                <div>
                    <button onClick={saveEditedPost}>Save</button>
                </div>
                <hr/>
            </div>
        </div>
    )
}



const EditPostComponentMemoComponent = React.memo(EditPostComponent)
export default EditPostComponentMemoComponent
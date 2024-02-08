import React from 'react';
import {ResponseTestAPIDataType, savePostThunk} from "../../../redux/MyPostsReducer";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import "../../../css/photo_drag_drop/drag_and_drop.css"
import DragPhoto from "../../drag_drop_img/DragPhoto";
import "../../../css/posts/posts_main_container.css"
import "../../../css/posts/edit_post.css"


type EditPostPropsType = {
    setEditPost: (value: any) => void,
    editPost: ResponseTestAPIDataType | null,
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    posts: Array<ResponseTestAPIDataType>
    onDropHandler: (event: any) => void
}
const EditPostComponent: React.FC<EditPostPropsType> = ({setEditPost, editPost, handleImageChange, posts, onDropHandler}) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const saveEditedPost = () => {
        const updateEditedPost = posts.map((item: ResponseTestAPIDataType) => item.id === editPost?.id ? editPost : item)
        dispatch(savePostThunk(updateEditedPost))
        setEditPost(null)
    };
    return (
        <div className="edit_mode_container">
            {/*EDIT POST SECTION*/}

            <div className="edit_post_info_section">
                <div className="edit_title">Change title</div>
                <input
                    placeholder="Type new title..."
                    type="text"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditPost({...editPost, title: event.currentTarget.value})}
                />

                <div className="edit_content_title">Change content:</div>
                <textarea
                    placeholder="Type a new post..."
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setEditPost({...editPost, content: event.currentTarget.value})}
                ></textarea>
            </div>




            <div className="post_image_edit_section">
                <div className="post_image">
                    <img src={editPost?.image}/>
                </div>

                <div className="photo_uploader_section">
                    <div className="photo_input_section">
                        <DragPhoto
                            onDropHandler={onDropHandler}
                        />
                    </div>
                    <input className="custom-file-input" key={editPost?.image || 'editPost'} type="file" accept="image/*" onChange={handleImageChange}/>
                </div>


            </div>


            <div className="edit_save_button">
                <button onClick={saveEditedPost}>Save</button>
            </div>
        </div>
    )
}


const EditPostComponentMemoComponent = React.memo(EditPostComponent)
export default EditPostComponentMemoComponent
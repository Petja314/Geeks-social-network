import React, {useState} from 'react';
import PaginationUsers from "../../users/users_pagination/PaginationUsers";
import {useDispatch, useSelector} from "react-redux";
import {MyPostsInitialState, onPageChangeThunk, ResponseTestAPIDataType} from "../../../redux/MyPostsReducer";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../../redux/Redux-Store";
import CurrentPostComponent from "./CurrentPostComponent";
import EditPostComponent from "./EditPostComponent";
import CreateNewPost from "./CreateNewPost";
import {compose} from "redux";
import {WithAuthRedirect} from "../../../hoc/WithAuthRedirect";
import usePostFetchAdmin from "./api_posts/usePostFetchAdmin";
import {isDraggingAC} from "../../drag_drop_img/DragReducer";
import "../../../css/posts/posts_main_container.css"


const MyPostsContainer = () => {
    const userId: number | null = useSelector((state: RootState) => state.userAuthPage.userId) // Getting authorized userID (admin)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const {posts, currentPage, pageSize}: MyPostsInitialState = useSelector((state: RootState) => state.myposts)
    const [newPost, setNewPost] = useState<ResponseTestAPIDataType>({id: 0, userId, title: '', content: '', likes: 0, image: ''}); //temporary  storage for new post
    const [editPost, setEditPost] = useState<ResponseTestAPIDataType | null>(null);//temporary storage for edit post section.
    // Run Fetch function to send posts data when the component mounts

    // console.log('posts' , posts)
    // console.log('userId' , userId)

    usePostFetchAdmin({userId})
    if (!posts) return <div>loading...</div> //Preloader
    console.log('userId : '  , userId)

    const handleChangesPhoto = async (files: FileList | null) => {
        if (files && files.length > 0) {
            const selectedFile = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileContent = e.target?.result as string;
                if (editPost) {
                    // If there's an editPost, update its image
                    setEditPost({
                        ...editPost,
                        image: fileContent,
                    });
                } else {
                    // If there's no editPost, create a new post
                    setNewPost({ ...newPost, image: fileContent });
                }
            };

            reader.readAsDataURL(selectedFile);
        }
    };
    const handleImageChange = (event : any) => {
        event.preventDefault()
        handleChangesPhoto(event.target.files)
    }
    const onDropHandler = (event: any) => {
        event.preventDefault();
        let files: FileList | null = event.dataTransfer.files;
        handleChangesPhoto(files)
        dispatch(isDraggingAC(false));
    };


    // Pagination logic
    const indexOfLastPost: number = currentPage * pageSize
    const indexOfFirstPost: number = indexOfLastPost - pageSize
    const currentPosts: Array<ResponseTestAPIDataType> = posts.slice(indexOfFirstPost, indexOfLastPost) //Show 5 posts per page
    const handlePageChangeMyPosts = (pageNumber: number) => {
        dispatch(onPageChangeThunk(pageNumber)); //dispatch current page
    };
    //Finding post.id match to edit.id , to show CURRENT POST / EDIT POST SECTION
    const foundPost = currentPosts.find((item: ResponseTestAPIDataType) => item.id === editPost?.id)
    return (
        <div className="container_all_posts">
            <h2 className="post_title">POSTS</h2>


            {/*VIEW CURRENT POSTS AND EDIT CURRENT POST SECTION*/}
            {!foundPost ?
                <CurrentPostComponent
                    posts={posts}
                    setEditPost={setEditPost}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    currentPosts={currentPosts}
                />
                :
                <EditPostComponent
                    onDropHandler={onDropHandler}
                    setEditPost={setEditPost}
                    editPost={editPost}
                    handleImageChange={handleImageChange}
                    posts={posts}
                />
            }

            {/*CREATE NEW POST SECTION */}
            <CreateNewPost
                onDropHandler={onDropHandler}
                newPost={newPost}
                setNewPost={setNewPost}
                handleImageChange={handleImageChange}
                posts={posts}
                userId={userId}
                pageSize={pageSize}
            />


            {/* PAGINATION */}
            <div className="pagination_container">
                <PaginationUsers
                    totalUsersCount={posts.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChangeMyPosts}
                />
            </div>
            {/*<div className={styles.paginationLabel}>CURRENT PAGE: {currentPage}</div>*/}
        </div>
    )
}


const MyPostsContainerMemoComponent = React.memo(MyPostsContainer)
export default compose(
    WithAuthRedirect
)(MyPostsContainerMemoComponent)














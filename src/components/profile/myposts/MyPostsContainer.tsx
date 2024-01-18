import React, {useEffect, useState} from 'react';
import PaginationUsers from "../../users/PaginationUsers";
import styles from './MyPosts.module.css';
import robot1 from "../../assets/images/robot-a4.png"
import robot2 from "../../assets/images/robot-a5.png"
import robot3 from "../../assets/images/robot-b1.png"
import robot4 from "../../assets/images/robot-b2.png"
import robot5 from "../../assets/images/robot-b3.png"
import robot6 from "../../assets/images/robot-b4.png"
import robot7 from "../../assets/images/robot-b5.png"
import {useDispatch, useSelector} from "react-redux";
import {actionsMyPosts, createNewPostThunk, fetchPostsThunk, MyPostsInitialState, onPageChangeThunk, ResponseTestAPIDataType, savePostThunk, setUserIdThunk} from "../../redux/MyPostsReducer";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import CurrentPostComponent from "./CurrentPostComponent";
import EditPostComponent from "./EditPostComponent";
import CreateNewPost from "./CreateNewPost";
import {compose} from "redux";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import {AuthState} from "../../redux/AuthReducer";
import Login from "../../login/Login";
import usePostFetchAdmin from "./usePostFetchAdmin";

const MyPostsContainer = () => {
    const userId: number | null = useSelector((state: RootState) => state.userAuthPage.userId) // Getting authorized userID (admin)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const {posts, currentPage, pageSize}: MyPostsInitialState = useSelector((state: RootState) => state.myposts)
    const [newPost, setNewPost] = useState<ResponseTestAPIDataType>({id: 0, userId, title: '', content: '', likes: 0, image: ''}); //temporary  storage for new post
    const [editPost, setEditPost] = useState<ResponseTestAPIDataType | null>(null);//temporary storage for edit post section.
    // Run Fetch function to send posts data when the component mounts
    usePostFetchAdmin({userId})
    if (!posts) return <div>loading...</div> //Preloader

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const resizedImage = reader.result as string;

                if (editPost) {
                    // If there's an editPost, update its image
                    setEditPost({
                        ...editPost,
                        image: resizedImage,
                    });
                } else {
                    // If there's no editPost, create a new post
                    setNewPost({...newPost, image: resizedImage});
                }
            };
            reader.readAsDataURL(file);
        }
    }; //Setting up image function , for CREATE and EDIT

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
        <div className={styles.container}>
            <h2 className={styles.heading}>POSTS</h2>

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
                    setEditPost={setEditPost}
                    editPost={editPost}
                    handleImageChange={handleImageChange}
                    posts={posts}
                />
            }

            {/*CREATE NEW POST SECTION */}
            <CreateNewPost
                newPost={newPost}
                setNewPost={setNewPost}
                handleImageChange={handleImageChange}
                posts={posts}
                userId={userId}
                pageSize={pageSize}
            />


            {/* PAGINATION */}
            <hr className={styles.hr}/>
            <div className={styles.paginationContainer}>
                <PaginationUsers
                    totalUsersCount={posts.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChangeMyPosts}
                />
            </div>
            <div className={styles.paginationLabel}>CURRENT PAGE: {currentPage}</div>

        </div>
    )
}


const MyPostsContainerMemoComponent = React.memo(MyPostsContainer)
export default compose(
    WithAuthRedirect
)(MyPostsContainerMemoComponent)














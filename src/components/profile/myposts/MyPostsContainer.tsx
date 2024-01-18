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
const MyPostsContainer = () => {
    const userId : number | null = useSelector((state: RootState) => state.userAuthPage.userId)
    const dispatch:  ThunkDispatch<RootState, void, any> = useDispatch()
    const {posts, currentPage, pageSize} : MyPostsInitialState = useSelector((state: RootState) => state.myposts)
    const [newPost, setNewPost] = useState<ResponseTestAPIDataType>({id: 0, userId, title: '', content: '', likes: 0, image: ''}); //temp storage for new post
    const [editPost, setEditPost] = useState<ResponseTestAPIDataType | null >(null);//temp storage for edit post section.
    //API SIMULATOR
    const simulateGetRequestAsync = async () => {
        await new Promise(( resolve: (value: unknown) => void) => setTimeout(resolve, 100)); // Simulating a delay
        // Simulate the response data
        const responseData : Array<ResponseTestAPIDataType> = [
            {id: 1, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot1},
            {id: 2, userId, title: 'Post 2', content: 'Some comments 2...', likes: 0, image: robot2},
            {id: 3, userId, title: 'Post 3', content: 'Some comments 3...', likes: 0, image: robot3},
            {id: 4, userId, title: 'Post 4', content: 'Some comments 4...', likes: 0, image: robot4},
            {id: 5, userId, title: 'Post 5', content: 'Some comments 4...', likes: 0, image: robot5},
            {id: 6, userId, title: 'Post 6', content: 'Some comments 4...', likes: 0, image: robot6},
            {id: 7, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot7},
            // Add more data as needed
        ];
        return responseData;
    };

    // Fetch posts when the component mounts
    useEffect(() => {
        // debugger
        dispatch(setUserIdThunk(userId))
        //Simulate of get request call
        simulateGetRequestAsync().then((responseData) => {
            // debugger
            dispatch(fetchPostsThunk(responseData))
        })
    }, [userId]);
    if (!posts) return <div>loading...</div> //Preloader

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file : File | undefined = e.target.files?.[0];
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
    };
    // Pagination logic
    const indexOfLastPost : number = currentPage * pageSize
    const indexOfFirstPost: number = indexOfLastPost - pageSize
    const currentPosts : Array<ResponseTestAPIDataType> = posts.slice(indexOfFirstPost, indexOfLastPost) //Show 5 posts per page
    const handlePageChangeMyPosts = (pageNumber: number) => {
        dispatch(onPageChangeThunk(pageNumber)); //dispatch current page
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>POSTS</h2>
            {/* EDIT && CURRENT POST SECTION */}
            <div className={styles.postsContainer}>
                {currentPosts.map((item: ResponseTestAPIDataType, index: number) => (
                    <div key={item.id} className={styles.postItem}>
                        {editPost?.id !== item.id ? (
                            <CurrentPostComponent
                                item={item}
                                posts={posts}
                                setEditPost={setEditPost}
                                pageSize={pageSize}
                                currentPage={currentPage}
                            />
                        ) : (
                            <EditPostComponent
                                setEditPost={setEditPost}
                                editPost={editPost}
                                handleImageChange={handleImageChange}
                                posts={posts}
                            />
                        )}
                    </div>
                ))}
            </div>
            <CreateNewPost
                newPost={newPost}
                setNewPost={setNewPost}
                handleImageChange={handleImageChange}
                posts={posts}
                userId={userId}
                pageSize={pageSize}
            />
            {/* Pagination */}
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














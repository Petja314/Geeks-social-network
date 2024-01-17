import React, {useEffect, useRef, useState} from 'react';
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
import {actionsMyPosts, createNewPostThunk, fetchPostsThunk, onPageChangeThunk, savePostThunk, setUserIdThunk} from "./MyPostsReducer";
import {executionAsyncResource} from "async_hooks";
import {Dispatch} from "redux";
const MyPosts = () => {
    const dispatch: Dispatch = useDispatch()

    const userId = useSelector((state : any) => state.userAuthPage.id)
    const {posts,currentPage,pageSize} = useSelector((state : any) => state.myposts)
    const [newPost, setNewPost] = useState<any>({id: 0, userId, title: '', content: '', likes: 0, image: ''});
    const [editPost, setEditPost] = useState<any>(null);

    const simulatedPosts = [
        {id: 1, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot1},
        {id: 2, userId, title: 'Post 2', content: 'Some comments 2...', likes: 0, image: robot2},
        {id: 3, userId, title: 'Post 3', content: 'Some comments 3...', likes: 0, image: robot3},
        {id: 4, userId, title: 'Post 4', content: 'Some comments 4...', likes: 0, image: robot4},
        {id: 5, userId, title: 'Post 5', content: 'Some comments 4...', likes: 0, image: robot5},
        {id: 6, userId, title: 'Post 6', content: 'Some comments 4...', likes: 0, image: robot6},
        {id: 7, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot7},
    ];

    // Fetch posts when the component mounts
    useEffect(() => {
        dispatch(setUserIdThunk(userId))
        dispatch(fetchPostsThunk(simulatedPosts))
    }, [userId]);

    if (!posts) return <div>loading...</div> //Preloader

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
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
    const addLike = (postId: any) => {
        let increaseLikes = posts.map((item : any) => (item.id === postId ? {...item, likes : item.likes +1} : item))
        dispatch(actionsMyPosts.addLikeToPostAC(increaseLikes))
    }
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
    const editPostHandler = (postId: number) => {
        const postToEdit = posts.find((item: any) => item.id === postId)
        setEditPost(postToEdit || null)
    };
    const saveEditedPost = () => {
        const updateEditedPost = posts.map((item: any) => item.id === editPost.id ? editPost : item)
        dispatch(savePostThunk(updateEditedPost))
        setEditPost(null)
    };


    // Pagination logic
    const indexOfLastPost = currentPage * pageSize
    const indexOfFirstPost = indexOfLastPost - pageSize
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost) //Show 5 posts per page
    const handlePageChangeMyPosts = (pageNumber: number) => {
        dispatch(onPageChangeThunk(pageNumber)); //dispatch current page
    };
    console.log('posts' , posts)
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>POSTS</h2>

            {/* VIEW CURRENT POST SECTION */}
            <div className={styles.postsContainer}>
                {currentPosts.map((item: any, index: any) => (
                    <div key={index} className={styles.postItem}>
                        {editPost?.id !== item.id ? (
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
                        ) : (
                            <div className={styles.editMode}>
                                {/*EDIT POST SECTION*/}
                                <div>
                                    <h3>Change title</h3>
                                    <input
                                        placeholder="Type new title..."
                                        type="text"
                                        onChange={(event) => setEditPost({...editPost, title: event.currentTarget.value})}

                                    />
                                </div>

                                <div className={styles.changeContent}>
                                    <div>Change content:</div>
                                    <textarea
                                        placeholder="Type a new post..."
                                        onChange={(event) => setEditPost({...editPost, content: event.currentTarget.value})}
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

export type CreateNewPostPropsType = {
    newPost: any
    setNewPost: any
    handleImageChange: any
    posts: any
    userId: any
    pageSize: any
}
const CreateNewPost:  React.FC<CreateNewPostPropsType> = ({  newPost,  setNewPost, handleImageChange,  posts, userId,pageSize }) => {
    const dispatch: any = useDispatch()
    const createPost = () => {
        const newPostId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1
        const updatedPost = {...newPost, id: newPostId}
        dispatch(createNewPostThunk(updatedPost)) //Sending the new post values to update the post[]
        setNewPost({id: 0, userId, title: '', content: '', likes: 0, image: ''})//Clear whe input fields after post was added.

        //SET CURRENT PAGE WHERE IS MY NEW POST
        const totalPosts = posts.length + 1; // +1 for the newly added post
        const totalPages = Math.ceil(totalPosts / pageSize);
        // Determine the new current page based on the total number of pages
        const newCurrentPage = totalPages
        dispatch(onPageChangeThunk(newCurrentPage))

    };
    const deleteAllPosts = () => {
        dispatch(actionsMyPosts.deleteAllPostsAC())
        dispatch(onPageChangeThunk(1));
    }

    let disableSentEmpty = newPost.title === '' || newPost.content === ''
    return (
        <div>
            {/* Create a new Post */}
            <div className={styles.newPostContainer}>
                <div>
                    <input
                        value={newPost.title}
                        type="text"
                        placeholder="Title"
                        onChange={(event) => setNewPost({...newPost, title: event.currentTarget.value})}
                    />
                </div>
                <textarea
                    value={newPost.content}
                    placeholder="Type a new post..."
                    onChange={(event) => setNewPost({...newPost, content: event.currentTarget.value})}
                ></textarea>

                <div>
                    <span>Select image:</span>
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


export default MyPosts;













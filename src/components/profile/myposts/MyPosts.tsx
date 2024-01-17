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
import {actionsMyPosts, createNewPostThunk, fetchPostsThunk, savePostThunk} from "./MyPostsReducer";
// @ts-ignore
// userId === authorized user ID
const MyPosts = ({userId}) => {
    const simulatedPosts = [
        {id: 1, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot1},
        {id: 2, userId, title: 'Post 2', content: 'Some comments 2...', likes: 0, image: robot2},
        {id: 3, userId, title: 'Post 3', content: 'Some comments 3...', likes: 0, image: robot3},
        {id: 4, userId, title: 'Post 4', content: 'Some comments 4...', likes: 0, image: robot4},
        {id: 5, userId, title: 'Post 5', content: 'Some comments 4...', likes: 0, image: robot5},
        {id: 6, userId, title: 'Post 6', content: 'Some comments 4...', likes: 0, image: robot6},
        {id: 7, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot7},
    ];

    const dispatch: any = useDispatch()
    const postsData = useSelector((state: any) => state.myposts)
    const currentPage = useSelector((state: any) => state.myposts.currentPage)
    const pageSize = useSelector((state: any) => state.myposts.pageSize)


    // States
    const [newPost, setNewPost] = useState<any>({id: 0, userId, title: '', content: '', likes: 0, image: ''});
    const [editPost, setEditPost] = useState<any>(null);
    // const [currentPage, setCurrentPage] = useState<any>(1);


    // Fetch posts when the component mounts
    useEffect(() => {
        dispatch(actionsMyPosts.setUserIdAC(userId))
        dispatch(fetchPostsThunk(simulatedPosts))
    }, [userId]);

    if (postsData.posts.length === 0) {
        return <div>loading...</div>
    }

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

    const createPost = () => {
        const newPostId = postsData.posts.length > 0 ? postsData.posts[postsData.posts.length - 1].id + 1 : 1
        const updatedPost = {...newPost, id: newPostId}
        dispatch(createNewPostThunk(updatedPost))
        setNewPost({id: 0, userId, title: '', content: '', likes: 0, image: ''})
    };
    console.log('new post input clear - ', newPost)

    const addLike = (postId: any) => {
        dispatch(actionsMyPosts.addLikeToPostAC(postId))
    }
    const deletePost = (postId: number) => {
        dispatch(actionsMyPosts.deletePostAC(postId));
        const remainingPosts = postsData.posts.length - 1;
        const newPage = Math.max(1, Math.ceil(remainingPosts / pageSize));
        dispatch(actionsMyPosts.changePageAC(newPage));
    };
    const deleteAllPosts = () => {
        dispatch(actionsMyPosts.deleteAllPostsAC())
    }
    const editPostHandler = (postId: number) => {
        const postToEdit = postsData.posts.find((item: any) => item.id === postId)
        setEditPost(postToEdit || null)
    };
    const saveEditedPost = () => {
        const updateEditedPost = postsData.posts.map((item: any) => item.id === editPost.id ? editPost : item)
        dispatch(savePostThunk(updateEditedPost))
        setEditPost(null)
    };
    // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = async () => {
    //             const resizedImage = reader.result as string
    //             if (editPost) {
    //                 // If there's an editPost, update its image
    //                 setEditPost({
    //                     ...editPost,
    //                     image: resizedImage,
    //                 });
    //             } else {
    //                 // If there's no editPost, create a new post
    //                 setNewPost({...newPost, image: resizedImage,});
    //             }
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    let disableSentEmpty = newPost.title === '' || newPost.content === ''
    //Indexes for pagination
    const indexOfLastPost = currentPage * pageSize
    const indexOfFirstPost = indexOfLastPost - pageSize
    const currentPosts = postsData.posts.slice(indexOfFirstPost, indexOfLastPost)

    const onPageChange = (pageNumber: any) => {
        dispatch(actionsMyPosts.changePageAC(pageNumber))
    }

    // console.log(postsData.posts)
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>POSTS</h2>

            {/* View Current Posts */}
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
                                        <img className={styles.postImage} src={item.image} alt="Post"/>
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
                                <div>
                                    <h3>{item.title}</h3>
                                    <input
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
                                    <img className={styles.postImage} src={editPost.image} alt="Post"/>
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
                    <img className={styles.postImage} src={newPost.image} alt="New Post"/>
                </div>

                <div className={styles.postButtons}>
                    <button disabled={disableSentEmpty} onClick={createPost}>
                        Create a post
                    </button>
                    <button onClick={deleteAllPosts}>Delete all posts</button>
                </div>
            </div>

            {/* Pagination */}
            <hr className={styles.hr}/>
            <div className={styles.paginationContainer}>

                <PaginationUsers
                    totalUsersCount={postsData.posts.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            </div>
            <div className={styles.paginationLabel}>CURRENT PAGE: {currentPage}</div>

        </div>
    )
}
export default MyPosts;


// import React, {useEffect, useRef, useState} from 'react';
// // import PaginationUsers from "../../users/PaginationUsers";
// // import styles from './MyPosts.module.css';
// // import robot1 from "../../assets/images/robot-a4.png"
// // import robot2 from "../../assets/images/robot-a5.png"
// // import robot3 from "../../assets/images/robot-b1.png"
// // import robot4 from "../../assets/images/robot-b2.png"
// // import robot5 from "../../assets/images/robot-b3.png"
// // import robot6 from "../../assets/images/robot-b4.png"
// // import robot7 from "../../assets/images/robot-b5.png"
//
// // @ts-ignore
// // userId === authorized user ID
// const MyPosts = ({userId}) => {
//     // States
//     const [posts, setPosts] = useState<any>([]);
//     const [newPost, setNewPost] = useState<any>({id: 0, userId, title: '', content: '', likes: 0, image: ''});
//     const [editPost, setEditPost] = useState<any>(null);
//     const [currentPage, setCurrentPage] = useState<any>(1);
//     const pageSize = 5;
//     let totalUsersCount = posts.length
//
//     // Fetch posts when the component mounts
//     useEffect(() => {
//         // Fetch your posts logic
//         fetchPosts()
//     }, [userId]);
//
//     // Function to fetch posts
//     const fetchPosts = () => {
//         // Fetch or generate your posts based on userId
//         // For now, using simulatedPosts as an example
//         const simulatedPosts = [
//             {id: 1, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot1},
//             {id: 2, userId, title: 'Post 2', content: 'Some comments 2...', likes: 0, image: robot2},
//             {id: 3, userId, title: 'Post 3', content: 'Some comments 3...', likes: 0, image: robot3},
//             {id: 4, userId, title: 'Post 4', content: 'Some comments 4...', likes: 0, image: robot4},
//             {id: 5, userId, title: 'Post 5', content: 'Some comments 4...', likes: 0, image: robot5},
//             {id: 6, userId, title: 'Post 6', content: 'Some comments 4...', likes: 0, image: robot6},
//             {id: 7, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot7},
//         ];
//         setPosts(simulatedPosts);
//     };
//
//     // Function to create a new post
//     const createPost = () => {
//         const newPostId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1
//         // debugger
//         const updatedPost = [...posts, {...newPost, id: newPostId}]
//         setCurrentPage(Math.ceil(updatedPost.length / pageSize));
//         setPosts(updatedPost)
//         setNewPost({id: 0, userId, title: '', content: '', likes: 0, image: ''})
//
//     };
//     console.log('newPost', newPost)
//
//
//     // Function to like a post
//     const addLike = (postId: any) => {
//         setPosts(posts.map((item: any) => (item.id === postId ? {...item, likes: item.likes + 1} : item)))
//     }
//     // Function to delete a post
//     const deletePost = (postId: number) => {
//         setPosts(posts.filter((item: any) => item.id !== postId));
//         if (currentPosts.length === 1 && currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//
//     };
//
//     // Function to delete all posts
//     const deleteAllPosts = () => {
//         setPosts([])
//     }
//     // Function to handle editing a post
//     const editPostHandler = (postId: number) => {
//         // Edit post logic
//         const postToEdit = posts.find((item: any) => item.id === postId)
//         setEditPost(postToEdit || null)
//     };
//
//     // Function to save edited post
//     const saveEditedPost = () => {
//         const updateEditedPost = posts.map((item: any) => item.id === editPost.id ? editPost : item)
//         debugger
//         setPosts(updateEditedPost)
//         setEditPost(null)
//         // Save edited post logic
//     };
//     const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = async () => {
//                 const resizedImage = reader.result as string
//                 if (editPost) {
//                     // If there's an editPost, update its image
//                     // debugger
//                     setEditPost({
//                         ...editPost,
//                         image: resizedImage,
//                     });
//                 } else {
//                     // If there's no editPost, create a new post
//                     setNewPost({ ...newPost,image: resizedImage,});
//                 }
//             };
//             reader.readAsDataURL(file);
//         }
//     };
//
//
//     let disableSentEmpty = newPost.title === '' || newPost.content === ''
//
//     //Indexes for pagination
//     const indexOfLastPost = currentPage * pageSize
//     const indexOfFirstPost = indexOfLastPost - pageSize
//     const currentPosts = posts.slice(indexOfFirstPost,indexOfLastPost)
//
//     const onPageChange = (pageNumber : any) => {
//         setCurrentPage(pageNumber)
//     }
//     return (
//         <div className={styles.container}>
//             <h2 className={styles.heading}>POSTS</h2>
//
//             {/* View Current Posts */}
//             <div className={styles.postsContainer}>
//                 {currentPosts.map((item : any, index : any) => (
//                     <div key={index} className={styles.postItem}>
//                         {editPost?.id !== item.id ? (
//                             <article>
//                                 <div className={styles.postInfo}>
//                                     <div className={styles.postDetail}>
//                                         <span className={styles.label}>Post Id:</span> {item.id}
//                                     </div>
//                                     <div className={styles.postDetail}>
//                                         <span className={styles.label}>Title:</span> {item.title}
//                                     </div>
//                                     <div className={styles.postDetail}>
//                                         <span className={styles.label}>Post content:</span> {item.content}
//                                     </div>
//
//                                     <div>
//                                         <img className={styles.postImage} src={item.image} alt="Post" />
//                                     </div>
//
//                                     <div className={styles.postButtons}>
//                                         <button onClick={() => addLike(item.id)}>Like + {item.likes}</button>
//                                         <button onClick={() => deletePost(item.id)}>Delete post</button>
//                                         <button onClick={() => editPostHandler(item.id)}>Edit</button>
//                                     </div>
//                                 </div>
//                                 <hr />
//                             </article>
//                         ) : (
//                             <div className={styles.editMode}>
//                                 <div>
//                                     <h3>{item.title}</h3>
//                                     <input
//                                         type="text"
//                                         onChange={(event) => setEditPost({ ...editPost, title: event.currentTarget.value })}
//                                     />
//                                 </div>
//
//                                 <div className={styles.changeContent}>
//                                     <div>Change content:</div>
//                                     <textarea
//                                         placeholder="Type a new post..."
//                                         onChange={(event) => setEditPost({ ...editPost, content: event.currentTarget.value })}
//                                     ></textarea>
//                                 </div>
//                                 <div>
//                                     <img className={styles.postImage} src={editPost.image} alt="Post" />
//                                     <input type="file" accept="image/*" onChange={handleImageChange} />
//                                 </div>
//
//                                 <div>
//                                     <button onClick={saveEditedPost}>Save</button>
//                                 </div>
//                                 <hr />
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//
//             {/* Create a new Post */}
//             <div className={styles.newPostContainer}>
//                 <div>
//                     <input
//                         value={newPost.title}
//                         type="text"
//                         placeholder="Title"
//                         onChange={(event) => setNewPost({ ...newPost, title: event.currentTarget.value })}
//                     />
//                 </div>
//                 <textarea
//                     value={newPost.content}
//                     placeholder="Type a new post..."
//                     onChange={(event) => setNewPost({ ...newPost, content: event.currentTarget.value })}
//                 ></textarea>
//
//                 <div>
//                     <span>Select image:</span>
//                     <input type="file" accept="image/*" onChange={handleImageChange} />
//                 </div>
//                 <div>
//                     <img className={styles.postImage} src={newPost.image} alt="New Post" />
//                 </div>
//
//                 <div className={styles.postButtons}>
//                     <button disabled={disableSentEmpty} onClick={createPost}>
//                         Create a post
//                     </button>
//                     <button onClick={deleteAllPosts}>Delete all posts</button>
//                 </div>
//             </div>
//
//             {/* Pagination */}
//             <hr className={styles.hr} />
//             <div className={styles.paginationContainer}>
//
//                 <PaginationUsers
//                     totalUsersCount={totalUsersCount}
//                     pageSize={pageSize}
//                     currentPage={currentPage}
//                     onPageChange={onPageChange}
//                 />
//             </div>
//             <div className={styles.paginationLabel}>CURRENT PAGE: {currentPage}</div>
//
//         </div>
//     )}
// export default MyPosts;











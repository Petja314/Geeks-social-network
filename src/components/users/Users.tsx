import React, {useEffect, useState} from 'react';
import styles from "./users.module.css";
import userPhoto from "../assets/images/louie.jpg";
import {FilterType, followUserThunkCreator, FormType, getUsersThunkCreator, unfollowUserThunkCreator, UsersComponentTypeArrays} from "../redux/UsersReducer";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import PaginationUsers from "./PaginationUsers";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {
    getCurrentPageSelector,
    getFollowingInProgressSelector,
    getIsFetchingSelector,
    getPageSizeSelector,
    getTotalUsersCountSelector,
    getUsersFilterSelector,
    getUsersPageSelector
} from "../redux/UsersSelectors";
import Preloader from "../common/preloader/Preloader";
import {compose} from "redux";
import queryString, {ParsedQuery} from 'query-string';
import {WithAuthRedirect} from "../hoc/WithAuthRedirect";


export type UsersTypeToProps = {}
const Users: React.FC<UsersTypeToProps> = (props) => {
    const dispatch: any = useDispatch()
    const navigate: any = useNavigate();
    const location: any = useLocation()



    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const totalUsersCount = useSelector(getTotalUsersCountSelector)
    const currentPage = useSelector(getCurrentPageSelector)
    const pageSize = useSelector(getPageSizeSelector)
    const followingInProgress = useSelector(getFollowingInProgressSelector)
    const isFetching = useSelector(getIsFetchingSelector)
    const filter: FilterType = useSelector(getUsersFilterSelector)


    useEffect(() => {
        const parsed: ParsedQuery = queryString.parse(location.search)
        let parsedCurrentPage = Number(parsed.page)
        if (isNaN(parsedCurrentPage) || parsedCurrentPage <= 0) {
            parsedCurrentPage = 1;
        }


        // debugger
        let parsedFilter = filter
        if (!!parsed.term) parsedFilter = {...parsedFilter, term: parsed.term as string}
        //filter needs to be :
        // {friend : true/false/null  , term "" }
        switch (parsed.friend) {
            case "null" :
                parsedFilter = {...parsedFilter, friend: null}
                break;
            case "true" :
                parsedFilter = {...parsedFilter, friend: true}
                break;
            case "false" :
                parsedFilter = {...parsedFilter, friend: false}
                break;
        }
        // console.log('location' , location.search)

        // dispatch(getUsersThunkCreator(currentPage, pageSize, filter))
        dispatch(getUsersThunkCreator(parsedCurrentPage, pageSize, parsedFilter))

    }, [])


    useEffect(() => {
        // console.log('currentPage' , currentPage)
        navigate(`?term=${filter.term}&friend=${filter.friend}&page=${currentPage}`)
    }, [filter, currentPage])

    const onFilterChanged = (filter: FilterType) => {
        dispatch(getUsersThunkCreator(1, pageSize, filter))
    }

    const handlePageChangeUsers = (pageNumber: number) => {
        dispatch(getUsersThunkCreator(pageNumber, pageSize, filter));
    };

    return (
        <div>
            <Preloader isFetching={isFetching}/>
            <div>
                <UsersSearchForm
                    onFilterChanged={onFilterChanged}
                />
            </div>

            <div>
                <PaginationUsers
                    totalUsersCount={totalUsersCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChangeUsers }
                />


            </div>
            {
                usersPage.users.map((item) =>
                    <div key={item.id}>
                    <span>

                        <NavLink to={'/profile/' + item.id}>
                        <div><img src={item.photos.small !== null ? item.photos.small : userPhoto} className={styles.usersPhoto}/></div>
                        </NavLink>

                        <div>
                            {item.followed
                                ? <button disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {
                                    dispatch(unfollowUserThunkCreator(item.id))
                                }}>Unfollow</button>

                                : <button disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {
                                    dispatch(followUserThunkCreator(item.id))
                                }}> Follow </button>}

                        </div>
                    </span>
                        <span>
                        <span>
                            <div>{item.name}</div>
                            <div>{item.status}</div>
                        </span>
                    </span>
                    </div>)}
        </div>
    );
};

const usersSearchFormValidate = (values: any) => {
    const errors = {};
    return errors
}
type UsersSearchFormPropsType = {
    onFilterChanged: (filter: FilterType) => void
}

const UsersSearchForm: React.FC<UsersSearchFormPropsType> = React.memo((props) => {
    const submit = (values: FormType, {setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
        //converting the values.friends into the boolean from string "true" => true (boolean) req. by the api docs.


        const filter: FilterType = {
            term: values.term,
            friend: values.friend === 'null' ? null : values.friend === "true" ? true : false
        }
        props.onFilterChanged(filter)
        // props.onFilterChanged(values)
        setSubmitting(false)
    }


    return (<div>
        <h3>Find user</h3>
        <Formik
            initialValues={{term: '', friend: 'null'}}
            validate={usersSearchFormValidate}
            onSubmit={submit}
        >
            {({isSubmitting}) => (
                <Form>
                    <Field type="text" name="term"/>

                    <Field name="friend" as="select">
                        <option value="null">All</option>
                        <option value="true">Only followed</option>
                        <option value="false">Only unfolowwed</option>
                    </Field>

                    <button type="submit" disabled={isSubmitting}>
                        Find
                    </button>
                </Form>
            )}
        </Formik>
    </div>)
})


export default compose(
    WithAuthRedirect
)(Users)



// import React, {useEffect, useRef, useState} from 'react';
// // import PaginationUsers from "../../users/PaginationUsers";
// // import styles from './MyPostsContainer.module.css';
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
// const MyPostsContainer = ({userId}) => {
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
// export default MyPostsContainer;

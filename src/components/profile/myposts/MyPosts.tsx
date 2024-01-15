import React, {useEffect, useState} from 'react';
import InputEmoji from 'react-input-emoji'
// @ts-ignore
// userId === authorized user ID
const MyPosts = ({userId}) => {
        // States
        const [posts, setPosts] = useState<any>([]);
        const [newPost, setNewPost] = useState<any>({id: 0, userId, title: '', content: '', likes: 0, image: ''});
        const [editPost, setEditPost] = useState<any>(null);
        const [currentPage, setCurrentPage] = useState<any>(1);
        const postsPerPage = 5;

        console.log('newPost', newPost)
        // console.log('posts', posts)
        // console.log('editPost', editPost)


        // Fetch posts when the component mounts
        useEffect(() => {
            // Fetch your posts logic
            fetchPosts()
        }, [userId]);

        // Function to fetch posts
        const fetchPosts = () => {
            // Fetch or generate your posts based on userId
            // For now, using simulatedPosts as an example
            const simulatedPosts = [
                {id: 1, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: ''},
                {id: 2, userId, title: 'Post 2', content: 'Some comments 2...', likes: 0, image: ''},
                {id: 3, userId, title: 'Post 3', content: 'Some comments 3...', likes: 0, image: ''},
                {id: 4, userId, title: 'Post 4', content: 'Some comments 4...', likes: 0, image: ''},
            ];
            setPosts(simulatedPosts);
        };

        // Function to create a new post
        const createPost = () => {
            const newPostId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1
            // debugger
            const updatedPost = [...posts, {...newPost, id: newPostId}]
            setPosts(updatedPost)
            // setNewPost({id: 0, userId, title: '', content: '', likes: 0, image: ''})
        };
        // Function to like a post
        const addLike = (postId: any) => {
            setPosts(posts.map((item: any) => (item.id === postId ? {...item, likes: item.likes + 1} : item)))
        }
        // Function to delete a post
        const deletePost = (postId: number) => {
            setPosts(posts.filter((item: any) => item.id !== postId))
        };
        // Function to delete all posts
        const deleteAllPosts = () => {
            setPosts([])
        }
        // Function to handle editing a post
        const editPostHandler = (postId: number) => {
            // Edit post logic
            const postToEdit = posts.find((item: any) => item.id === postId)
            setEditPost(postToEdit || null)
        };

        // Function to save edited post
        const saveEditedPost = () => {
            const updateEditedPost = posts.map((item: any) => item.id === editPost.id ? editPost : item)
            // debugger
            setPosts(updateEditedPost)
            setEditPost(null)
            // Save edited post logic
        };
        // Function to handle image change
        const handleImageChange = async (event: any) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const imageDataUrl = reader.result as string
                if (editPost) {
                    // If there's an editPost, update its image
                    setEditPost({
                        ...editPost,
                        image: imageDataUrl,
                    });
                } else {
                    // If there's no editPost, create a new post
                    setNewPost({
                        ...newPost,
                        image: imageDataUrl,
                    });
                }
            };
            reader.readAsDataURL(file);
        }
        }
let disableSentEmpty = newPost.title === '' || newPost.content === ''
// Calculate indexes for pagination
// const indexOfLastPost = currentPage * postsPerPage;
// const indexOfFirstPost = indexOfLastPost - postsPerPage;
// const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);


        return (
            <div style={{marginTop: "30px"}}>
                <h2>POSTS</h2>

                {/*View Current Posts*/}
                <div style={{border: "1px solid black", padding: "0 auto", width: "20%"}}>
                    {posts.map((item: any, index: any) => (<div>
                            {editPost?.id !== item.id ? (<ul>
                                    <div>Post Id : {item.id}</div>
                                    <div>Title : {item.title} </div>
                                    <div>Post content : {item.content} </div>

                                    <div><img style={{maxWidth: "130px"}} src={item.image} alt=""/></div>

                                    <button onClick={() => {
                                        addLike(item.id)
                                    }}>Like + {item.likes} </button>

                                    <button onClick={() => {
                                        deletePost(item.id)
                                    }}>delete post
                                    </button>

                                    <button onClick={() => {
                                        editPostHandler(item.id)
                                    }}>Edit
                                    </button>
                                    <hr/>
                                </ul>)
                                : (
                                    <div>edit mode Selected
                                        <div>
                                            {item.title}
                                            <input
                                                type="text"
                                                onChange={(event: any) => setEditPost({...editPost, title: event.currentTarget.value})}/>
                                        </div>

                                        <div style={{margin: "10px"}}>
                                            <div> Change content :</div>
                                            <textarea
                                                placeholder="type a new post..."
                                                onChange={(event: any) => setEditPost({...editPost, content: event.currentTarget.value})}>
                                        </textarea>
                                        </div>
                                        <div><img
                                            style={{maxWidth: "130px"}}
                                            src={item.image}
                                            alt="img"/>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />

                                        </div>

                                        <div>
                                            <button onClick={saveEditedPost}> Save</button>
                                        </div>
                                        <hr/>
                                    </div>


                                )
                            }
                        </div>
                    ))
                    }

                </div>

                {/*Create a new Post*/}
                <div>
                    <div><input type="text" placeholder="Title" onChange={(event: any) => setNewPost({...newPost, title: event.currentTarget.value})}/></div>
                    <textarea placeholder="type a new post..." onChange={(event: any) => setNewPost({...newPost, content: event.currentTarget.value})}></textarea>

                    <div>Select image :
                        <input type="file" accept="image/*" onChange={handleImageChange}
                        /></div>
                    <div>
                        <img style={{maxWidth: "130px"}} src={newPost.image} alt=""/>
                    </div>
                    <div>
                        <button disabled={disableSentEmpty} onClick={createPost}>Create a post</button>
                    </div>
                    <div>
                        <button onClick={deleteAllPosts}>Delete all posts</button>
                    </div>
                </div>


            </div>
        );
    }
;
export default MyPosts;


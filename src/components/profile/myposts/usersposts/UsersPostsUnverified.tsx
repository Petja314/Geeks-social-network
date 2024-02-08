import React from 'react';
import { MyPostsInitialState, onPageChangeThunk, ResponseTestAPIDataType, setUnverifiedUserIDThunk, setUserIdThunk} from "../../../../redux/MyPostsReducer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import CurrentPostComponent from "../CurrentPostComponent";
import PaginationUsers from "../../../users/PaginationUsers";
import usePostFetchUsers from "./usePostFetchUsers";

// THAT IS POST COMPONENT FOR UNVERIFIED USER (NOT THE ADMIN)
const UsersPostsUnverified: React.FC<{ idUserURL: number }> = ({idUserURL}) => {
    const {posts, currentPage, pageSize}: MyPostsInitialState = useSelector((state: RootState) => state.myposts)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()

    // Run Fetch function to send posts data when the component mounts
    usePostFetchUsers({idUserURL})
    if (!posts) return <div>loading...</div> //Preloader

    const indexOfLastPost: number = currentPage * pageSize
    const indexOfFirstPost: number = indexOfLastPost - pageSize
    const currentPosts: Array<ResponseTestAPIDataType> = posts.slice(indexOfFirstPost, indexOfLastPost) //Show 5 posts per page
    const handlePageChangeMyPosts = (pageNumber: number) => {
        dispatch(onPageChangeThunk(pageNumber)); //dispatch current page
    };
    return (
        <div>
            <div >
                <h2>POSTS</h2>

                <CurrentPostComponent
                    idUserURL={idUserURL}
                    currentPosts={currentPosts}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    posts={posts}
                />

                <div >
                    <PaginationUsers
                        totalUsersCount={posts.length}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChangeMyPosts}
                    />
                </div>
            </div>
        </div>
    );
};

const UsersPostsUnverifiedMemoComponent = React.memo(UsersPostsUnverified)
export default UsersPostsUnverifiedMemoComponent
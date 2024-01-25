import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getFollowingInProgressSelector, getIsFetchingSelector} from "../redux/UsersSelectors";
import {unfollowUserThunkCreator} from "../redux/UsersReducer";
import PaginationUsers from "../users/PaginationUsers";
import userPhoto from "../assets/images/louie.jpg";
import styles from "../users/users.module.css";
import {FriendsListStateType, setFriendListThunkCreator} from "../redux/FriendsReducer";
import {RootState} from "../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import {compose, Dispatch} from "redux";
import {NavLink} from "react-router-dom";
import {WithAuthRedirect} from "../hoc/WithAuthRedirect";
import Preloader from "../common/preloader/Preloader";
import UserAvatarPhoto from "../users/UserAvatarPhoto";
import {startChatThunk} from "../redux/DialogsReducer";

const Friends = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();
    const followingInProgress = useSelector(getFollowingInProgressSelector)
    const isFetching = useSelector(getIsFetchingSelector)
    const {friends, totalCount, pageSize, currentPage}: FriendsListStateType = useSelector((state: RootState) => state.friendPage);

    useEffect(() => {
        // getting the current users who are followed with an api request
        // debugger
        dispatch(setFriendListThunkCreator(currentPage, true));
    }, [currentPage]); //dependency to track the current page

    const handlePageChangeUsers = (pageNumber: number) => {
        dispatch(setFriendListThunkCreator(pageNumber, true)); //dispatch current page
    };

    return (
        <div>

            <Preloader isFetching={isFetching}/>
            <h2>List of friends</h2>

            <div>
                <PaginationUsers
                    totalUsersCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChangeUsers}
                />
            </div>

            {friends.map((item) => (
                <div key={item.id}>
                    <span>
                        {/*NAVIGATING TO THE USER PROFILE BY CLICK ON IMAGE*/}
                        {item.followed &&
                            <div>
                                <NavLink to={'/profile/' + item.id}>
                                    {/*<span><img src={item.photos.small !== null ? item.photos.small : userPhoto} className={styles.usersPhoto}/></span>*/}
                                    <UserAvatarPhoto photos={item.photos.small}/>
                                </NavLink>
                                {/*<div><img src={item.photos.small !== null ? item.photos.small : userPhoto} className={styles.usersPhoto}/></div>*/}
                                <div>{item.name}</div>
                                <button disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {
                                    dispatch(unfollowUserThunkCreator(item.id))
                                }}>Unfollow
                                </button>
                                <NavLink to={'/dialogscontainer/' + item.id}>
                                    <button onClick={() => dispatch(startChatThunk(item.id, item.name))}>Start Chat</button>
                                </NavLink>
                            </div>
                        }
                    </span>

                </div>
            ))}


        </div>
    )
}


const FriendsMemoComponent = React.memo(Friends)
export default compose(
    WithAuthRedirect
)(FriendsMemoComponent)





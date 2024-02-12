import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getFollowingInProgressSelector, getIsFetchingSelector} from "../../redux/selectors/UsersSelectors";
import {unfollowUserThunkCreator} from "../../redux/UsersReducer";
import PaginationUsers from "../users/PaginationUsers";
import {FriendsListStateType, setFriendListThunkCreator, unfollowFriendThunkCreator} from "../../redux/FriendsReducer";
import {RootState} from "../../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import {compose} from "redux";
import {NavLink} from "react-router-dom";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import UserAvatarPhoto from "../users/UserAvatarPhoto";
import {startChatThunk} from "../../redux/DialogsReducer";
import "../../css/users/users-friends.css"
import {TypingEffects} from "../openAi/typing-effect";

const Friends = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();
    const followingInProgress = useSelector(getFollowingInProgressSelector)
    const {friends, totalCount, pageSize, currentPage}: FriendsListStateType = useSelector((state: RootState) => state.friendPage);

    useEffect(() => {
        // getting the current users who are followed with an api request
        // debugger
        dispatch(setFriendListThunkCreator(currentPage, true));
    }, [currentPage]);

    const handlePageChangeUsers = (pageNumber: number) => {
        dispatch(setFriendListThunkCreator(pageNumber, true)); //dispatch current page
    };
    // console.log('friends' , friends)
    return (
        <div className="user_container">
            <h2> <TypingEffects text={"List of friends"} speed={60}/></h2>

                <div className="users_section">
                    {friends.map((item) => (
                        <div className="user_section_box" key={item.id}>
                                {/*NAVIGATING TO THE USER PROFILE BY CLICK ON IMAGE*/}
                                    <NavLink to={'/profile/' + item.id}>
                                        {/*<span><img src={item.photos.small !== null ? item.photos.small : userPhoto} className={styles.usersPhoto}/></span>*/}
                                        <UserAvatarPhoto photos={item.photos.small}/>
                                    </NavLink>
                                <div className="user_name">{item.name}</div>


                                <div className="followed_section">
                                    {item.followed &&
                                        <div>
                                            {/*<div><img src={item.photos.small !== null ? item.photos.small : userPhoto} className={styles.usersPhoto}/></div>*/}
                                            <div className="followed_section">
                                                <button disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {
                                                    dispatch(unfollowFriendThunkCreator(item.id,currentPage))
                                                }}>Unfollow
                                                </button>
                                            </div>
                                            <NavLink to={'/dialogs/' + item.id}>
                                                <button onClick={() => dispatch(startChatThunk(item.id, item.name, item.photos.small))}>Start Chat</button>
                                            </NavLink>
                                        </div>
                                    }
                                </div>
                        </div>
                    ))}
                </div>

            <div className="pagination_section">
                <PaginationUsers
                    totalUsersCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChangeUsers}
                />
            </div>




        </div>
    )
}


const FriendsMemoComponent = React.memo(Friends)
export default compose(
    WithAuthRedirect
)(FriendsMemoComponent)





import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getFollowingInProgressSelector} from "../../redux/selectors/UsersSelectors";
import {FriendsListStateType, FriendsType, setFriendListThunkCreator, setFriendsMobileListThunkCreator, unfollowFriendThunkCreator} from "../../redux/FriendsReducer";
import {RootState} from "../../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import {compose} from "redux";
import {NavLink} from "react-router-dom";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import UserAvatarPhoto from "../users/users_avatars/UserAvatarPhoto";
import {startChatThunk} from "../../redux/DialogsReducer";
import "../../css/users/users-friends.css"
import {TypingEffects} from "../openAi/typing-effect";
import {UseWindowSize} from "../users/custom_hook_isMobile/useWindowSize";
import FriendsDesktop from "./FriendsDesktop";
import FriendsMobile from "./FriendsMobile";

const FriendsContainer = () => {
    const {width} = UseWindowSize()
    const isMobile : boolean = width <= 1280
    const {friends, currentPage, totalCount, pageSize}: FriendsListStateType = useSelector((state: RootState) => state.friendPage);

    return (
        <div className="user_container">
            <h2><TypingEffects text={"List of friends"} speed={60}/></h2>

            { isMobile ? (
                <FriendsMobile
                    totalCount={totalCount}
                    friends={friends}
                />
            ) : (
                <FriendsDesktop
                    totalCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                />
            )
            }

        </div>
    )
}
export const FriendsSection = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();
    const {friends, currentPage}: FriendsListStateType = useSelector((state: RootState) => state.friendPage);
    const followingInProgress = useSelector(getFollowingInProgressSelector)


    return (
        <div>
            <div className="users_section">
                {friends.map((item) => (
                    <div className="user_section_box" key={item.id}>
                        {/*NAVIGATING TO THE USER PROFILE BY CLICK ON IMAGE*/}
                        <NavLink to={'/profile/' + item.id}>
                            <UserAvatarPhoto photos={item.photos.small}/>
                        </NavLink>
                        <div className="user_name">{item.name}</div>


                        <div className="followed_section">
                            {item.followed &&
                                <div>
                                    <div className="followed_section">
                                        <button  disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {
                                            dispatch(unfollowFriendThunkCreator(item.id, currentPage))
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
        </div>
    )
}


const FriendsMemoComponent = React.memo(FriendsContainer)
export default compose(
    WithAuthRedirect
)(FriendsMemoComponent)





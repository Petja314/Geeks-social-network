import React, {useEffect, useState} from 'react';
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import {useDispatch, useSelector} from "react-redux";
import {NavigateFunction, NavLink, useLocation, useNavigate} from "react-router-dom";
import {FilterType, followUserThunkCreator, getUsersThunkCreator, unfollowUserThunkCreator, UsersComponentTypeArrays} from "../../redux/UsersReducer";
import {
    getCurrentPageSelector,
    getFollowingInProgressSelector,
    getPageSizeSelector,
    getTotalUsersCountSelector, getUsersFilterSelector,
    getUsersPageSelector
} from "../../redux/selectors/UsersSelectors";
import {UseWindowSize} from "./custom_hook_isMobile/useWindowSize";
import UserAvatarPhoto from "./users_avatars/UserAvatarPhoto";
import {startChatThunk} from "../../redux/DialogsReducer";
import {TypingEffects} from "../openAi/typing-effect";
import UsersSearchForm from "./UsersSearchForm";
import UsersMobile from "./UsersMobile";
import UsersDesktop from "./UsersDesktop";
import {compose} from "redux";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";

const UsersContainer = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const navigate: NavigateFunction = useNavigate();
    // Selectors
    const totalUsersCount: number = useSelector(getTotalUsersCountSelector)
    const currentPage: number = useSelector(getCurrentPageSelector)
    const pageSize: number = useSelector(getPageSizeSelector)
    const filter: FilterType = useSelector(getUsersFilterSelector)
    const {width} = UseWindowSize()
    const isMobile: boolean = width <= 1280

    useEffect(() => {
        navigate(`?term=${filter.term}&friend=${filter.friend}&page=${currentPage}`)
    }, [filter, currentPage])

    const onFilterChanged = (filter: FilterType) => {
        dispatch(getUsersThunkCreator(1, pageSize, filter))
    }
    // console.log('isMobile', isMobile)
    return (
        <div>

            <h2><TypingEffects text={"USERS PAGE"} speed={60}/></h2>
            <div className="find_section">
                <UsersSearchForm
                    filter={filter.friend}
                    onFilterChanged={onFilterChanged}
                />
            </div>


            {isMobile ? (
                <UsersMobile
                    pageSize={pageSize}
                    filter={filter}
                /> ) : (
                    <UsersDesktop
                    pageSize={pageSize}
                    filter={filter}
                    totalUsersCount={totalUsersCount}
                    currentPage={currentPage}
                />)
            }

        </div>
    );
};

export const UsersSection = () => {
    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const followingInProgress: [] = useSelector(getFollowingInProgressSelector)
    const dispatch: any = useDispatch()
    return (
        <div className="users_section">
            {
                usersPage.users.map((item: any) =>
                    <div className="user_section_box" key={item.id}>
                        {/*NAVIGATING TO THE USER PROFILE BY CLICK ON IMAGE*/}
                        <NavLink to={'/profile/' + item.id}>
                            <UserAvatarPhoto photos={item.photos.small}/>
                        </NavLink>
                        <div className="user_name">{item.name}</div>

                        <div className="followed_section">
                            {item.followed
                                ? <button disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {
                                    dispatch(unfollowUserThunkCreator(item.id))
                                }}>Unfollow</button>

                                : <button disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {
                                    dispatch(followUserThunkCreator(item.id))
                                }}> Follow </button>}
                        </div>

                        <div className="start_chat_section">
                            <NavLink to={'/dialogs/' + item.id}>
                                <button onClick={() => dispatch(startChatThunk(item.id, item.name, item.photos.small))}>Start Chat</button>
                            </NavLink>
                        </div>
                    </div>)}

        </div>
    )
}

const UsersContainerMemoComponent = React.memo(UsersContainer)
export default compose(
    WithAuthRedirect
)(UsersContainerMemoComponent)


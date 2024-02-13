import React, {useEffect, useState} from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import Users, {LocationParams} from "./Users";
import Preloader from "../../common/preloader/Preloader";
import {compose} from "redux";
import {
    getCurrentPageSelector,
    getFollowingInProgressSelector,
    getIsFetchingSelector,
    getPageSizeSelector,
    getTotalUsersCountSelector,
    getUsersFilterSelector,
    getUsersPageSelector
} from "../../redux/selectors/UsersSelectors";
import {FilterType, followUserThunkCreator, getUsersThunkCreator, unfollowUserThunkCreator, UsersArrayType, UsersComponentTypeArrays} from "../../redux/UsersReducer";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import {NavigateFunction, NavLink, useLocation, useNavigate} from "react-router-dom";
import UserAvatarPhoto from "./UserAvatarPhoto";
import {startChatThunk} from "../../redux/DialogsReducer";
import {UseWindowSize} from "./custom_hook_scroll/useWindowSize";
import PaginationUsers from "./PaginationUsers";
import InfiniteScroll from "react-infinite-scroll-component";
import UsersSearchForm from "./UsersSearchForm";
import queryString, {ParsedQuery} from "query-string";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import {TypingEffects} from "../openAi/typing-effect";

type UsersPagePropsType = {}
const UsersPage: React.FC<UsersPagePropsType> = () => {
    const navigate: NavigateFunction = useNavigate();
    const location: LocationParams = useLocation()
    const isFetching = useSelector(getIsFetchingSelector)
    const dispatch: any = useDispatch()
    const currentPage = useSelector(getCurrentPageSelector)
    const pageSize = useSelector(getPageSizeSelector)
    const filter: FilterType = useSelector(getUsersFilterSelector)
    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const totalUsersCount: number = useSelector(getTotalUsersCountSelector)

    const {width} = UseWindowSize()
    const isMobile = width <= 450

    useEffect(() => {
        const parsed: ParsedQuery = queryString.parse(location.search) //parsing string from location search(url)
        let parsedCurrentPage = Number(parsed.page) //page number from parsed url
        if (isNaN(parsedCurrentPage) || parsedCurrentPage <= 0) { //setting page to 1 if parsedPage isNaN or less or equal to page=0
            parsedCurrentPage = 1;
        }
        let parsedFilter = filter
        if (!!parsed.term) parsedFilter = {...parsedFilter, term: parsed.term as string}
        //filter needs to be :
        // {friend : true/false/null  , term "" }
        switch (parsed.friend) { //making the parsed.friend : "true" , "false" , "null" from string to boolean!
            case "null" :
                parsedFilter = {...parsedFilter, friend: null}
                break;
            case "true" :
                parsedFilter = {...parsedFilter, friend: true}
                break;
            case "false" :
                parsedFilter = {...parsedFilter, friend: false}
                break;
        } // after parsedFilter would look like that : parsedFilter = { term : "", friend : boolean | null }
        //dispatching data to get thunk to get correct response from API
        dispatch(getUsersThunkCreator(parsedCurrentPage, pageSize, parsedFilter ,isMobile))
    }, [])

    // Connecting the data from api with navigate to get the right url
    useEffect(() => {
        navigate(`?term=${filter.term}&friend=${filter.friend}&page=${currentPage}`)
    }, [filter, currentPage])

    const onFilterChanged = (filter: FilterType) => {
        dispatch(getUsersThunkCreator(1, pageSize, filter,isMobile))
    }

    // console.log('usersPage', usersPage.users)
    console.log("users" , usersPage.users)


    return <>
        <div className="user_container">


            <h2><TypingEffects text={"USERS PAGE"} speed={60}/></h2>
            <div className="find_section">
                <UsersSearchForm
                    filter={filter.friend}
                    onFilterChanged={onFilterChanged}
                />
            </div>

            <Preloader isFetching={isFetching}/>


            {isMobile ? (<MobileUsers
                pageSize={pageSize}
                currentPage={currentPage}
                usersPage={usersPage}
                filter={filter}
                isMobile={isMobile}
            />) : (
                <DesktopUsers
                    totalUsersCount={totalUsersCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    filter={filter}
                    isMobile={isMobile}
                />
            )
            }

        </div>
    </>
}

export default compose(
    WithAuthRedirect
)(UsersPage)


const UsersSection = () => {
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


const DesktopUsers = ({totalUsersCount, pageSize, currentPage, filter,isMobile}: any) => {
    console.log('DESKTOP USERS IN')
    const dispatch: any = useDispatch()

    useEffect(() =>{
        dispatch(getUsersThunkCreator(1, pageSize, filter,isMobile));
    },[])
    const handlePageChangeUsers = (pageNumber: number) => {
        dispatch(getUsersThunkCreator(pageNumber, pageSize, filter,isMobile));
    };

    return (
        <>
            <UsersSection/>
            <div className="pagination_section">
                <PaginationUsers
                    totalUsersCount={totalUsersCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChangeUsers}
                />
            </div>
        </>
    )
}

const MobileUsers = ({currentPage, pageSize, filter, usersPage, isMobile}: any) => {
    // console.log('MOBILE USERS IN')
    const [isLoading, setIsLoading] = useState(false)
    const dispatch: any = useDispatch()


    // SETTING THE CURRENT PAGE TO 1 BY DEFAULT WHEN I SWITCH TO MOBILE VERSION

    useEffect(() =>{
         dispatch(getUsersThunkCreator(1, pageSize, filter,isMobile));
    },[])

    // SCROLL WORKAROUND - PASSING isMobile to fetch more users in array [...users, action...users]
    const scrollHandler = async (event: React.UIEvent<HTMLDivElement>) => {
        const elementDialogs = event.currentTarget;
        const bottomOfPage: number = elementDialogs.scrollHeight - (elementDialogs.scrollTop + elementDialogs.clientHeight);
        const topOfPage: number = elementDialogs.scrollTop
        if (bottomOfPage < 100) {
            setIsLoading(true);
            await dispatch(getUsersThunkCreator(currentPage + 1, pageSize, filter,isMobile));
            setIsLoading(false);
        }
    };
    console.log('currentPages', currentPage)


    return (
        <div style={{overflow: 'hidden', height: '100vh', overflowY: 'scroll'}} onScroll={scrollHandler}>
            <UsersSection/>
            {isLoading && <h4>LOADING...</h4>}
        </div>
    )
}

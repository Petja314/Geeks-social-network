import React, {useEffect, useState} from 'react';
import {FilterType, followUserThunkCreator, getUsersThunkCreator, unfollowUserThunkCreator, UsersComponentTypeArrays} from "../../redux/UsersReducer";
import {NavigateFunction, NavLink, useLocation, useNavigate} from "react-router-dom";
import PaginationUsers from "./PaginationUsers";
import {useDispatch, useSelector} from "react-redux";
import {
    getCurrentPageSelector,
    getFollowingInProgressSelector,
    getIsFetchingSelector,
    getPageSizeSelector,
    getTotalUsersCountSelector,
    getUsersFilterSelector,
    getUsersPageSelector
} from "../../redux/selectors/UsersSelectors";
import Preloader from "../../common/preloader/Preloader";
import {compose} from "redux";
import queryString, {ParsedQuery} from 'query-string';
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import UsersSearchForm from "./UsersSearchForm";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import UserAvatarPhoto from "./UserAvatarPhoto";
import {startChatThunk} from "../../redux/DialogsReducer";
import "../../css/users/users-friends.css"
import {TypingEffects} from "../openAi/typing-effect";
import InfiniteScroll from "react-infinite-scroll-component";
import {UseWindowSize} from "./custom_hook_scroll/useWindowSize"



export interface LocationParams {
    pathname: string;
    state: null;
    search: string;
    hash: string;
    key: string;
}

const Users = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const navigate: NavigateFunction = useNavigate();
    const location: LocationParams = useLocation()
    // Selectors
    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const totalUsersCount: number = useSelector(getTotalUsersCountSelector)
    const currentPage: number = useSelector(getCurrentPageSelector)
    const pageSize: number = useSelector(getPageSizeSelector)
    const followingInProgress: [] = useSelector(getFollowingInProgressSelector)
    const isFetching = useSelector(getIsFetchingSelector)
    const filter: FilterType = useSelector(getUsersFilterSelector)


    const [isLoading, setIsLoading] = useState(false)
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
        // dispatch(getUsersThunkCreator(parsedCurrentPage, pageSize, parsedFilter))
    }, [])

    // Connecting the data from api with navigate to get the right url
    useEffect(() => {
        navigate(`?term=${filter.term}&friend=${filter.friend}&page=${currentPage}`)
    }, [filter, currentPage])

    //Filtration by users followed/unfollowed/all
    // const onFilterChanged = (filter: FilterType) => {
    //     dispatch(getUsersThunkCreator(1, pageSize, filter))
    // }
    // const handlePageChangeUsers = (pageNumber: number) => {
    //     // console.log('PAGE CHANGED')
    //     // console.log('pageNumber' , pageNumber)
    //     dispatch(getUsersThunkCreator(pageNumber, pageSize, filter));
    // };
    //
    //
    //     const scrollHandlerUsers = () => {
    //         setIsLoading(true)
    //         debugger
    //         dispatch(getUsersThunkCreator(currentPage +1, pageSize, filter));
    //         setIsLoading(false)
    //     }

    // console.log('usersPage.users.length' , usersPage.users)
    return (
        <div className="user_container">
            {/*{ !isMobile &&*/}
            {/*    <InfiniteScroll*/}
            {/*    style={{overflow: 'hidden'}}*/}
            {/*    dataLength={usersPage.users.length}*/}
            {/*    // next={scrollHandlerUsers}*/}
            {/*    hasMore={true}*/}
            {/*    // hasMore={data.length === 100 ? false : true} // data.length 100-120 posts is the limit by api!*/}
            {/*    loader={<h4>Loading...</h4>}*/}
            {/*>*/}


            {/*    <h2><TypingEffects text={"USERS PAGE"} speed={60}/></h2>*/}
            {/*    <div className="find_section">*/}
            {/*        <UsersSearchForm*/}
            {/*            filter={filter.friend}*/}
            {/*            onFilterChanged={onFilterChanged}*/}
            {/*        />*/}
            {/*    </div>*/}

            {/*    <Preloader isFetching={isFetching}/>*/}

            {/*    <div className="users_section">*/}
            {/*        {*/}
            {/*            usersPage.users.map((item) =>*/}
            {/*                <div className="user_section_box" key={item.id}>*/}
            {/*                    /!*NAVIGATING TO THE USER PROFILE BY CLICK ON IMAGE*!/*/}
            {/*                    <NavLink to={'/profile/' + item.id}>*/}
            {/*                        <UserAvatarPhoto photos={item.photos.small}/>*/}
            {/*                    </NavLink>*/}
            {/*                    <div className="user_name">{item.name}</div>*/}


            {/*                    <div className="followed_section">*/}
            {/*                        {item.followed*/}
            {/*                            ? <button disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {*/}
            {/*                                dispatch(unfollowUserThunkCreator(item.id))*/}
            {/*                            }}>Unfollow</button>*/}

            {/*                            : <button disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {*/}
            {/*                                dispatch(followUserThunkCreator(item.id))*/}
            {/*                            }}> Follow </button>}*/}
            {/*                    </div>*/}


            {/*                    <div className="start_chat_section">*/}
            {/*                        <NavLink to={'/dialogs/' + item.id}>*/}
            {/*                            <button onClick={() => dispatch(startChatThunk(item.id, item.name, item.photos.small))}>Start Chat</button>*/}
            {/*                        </NavLink>*/}
            {/*                    </div>*/}
            {/*                </div>)}*/}

            {/*    </div>*/}



            {/*</InfiniteScroll>*/}
            {/*}*/}
            {/*<div className="pagination_section">*/}
            {/*    <PaginationUsers*/}
            {/*        totalUsersCount={totalUsersCount}*/}
            {/*        pageSize={pageSize}*/}
            {/*        currentPage={currentPage}*/}
            {/*        onPageChange={handlePageChangeUsers}*/}
            {/*    />*/}
            {/*</div>*/}
        </div>
    );
};


const UsersMemoComponent = React.memo(Users)
export default compose(
    WithAuthRedirect
)(UsersMemoComponent)



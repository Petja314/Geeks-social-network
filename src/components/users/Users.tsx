import React, {useEffect} from 'react';
import styles from "./users.module.css";
import userPhoto from "../assets/images/louie.jpg";
import { FilterType, followUserThunkCreator,  getUsersThunkCreator, unfollowUserThunkCreator, UsersComponentTypeArrays} from "../redux/UsersReducer";
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
} from "../redux/UsersSelectors";
import Preloader from "../common/preloader/Preloader";
import {compose} from "redux";
import queryString, {ParsedQuery} from 'query-string';
import {WithAuthRedirect} from "../hoc/WithAuthRedirect";
import UsersSearchForm from "./UsersSearchForm";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../redux/Redux-Store";

export interface LocationParams {
    pathname: string;
    state: null;
    search: string;
    hash: string;
    key: string;
}
const Users = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const navigate: NavigateFunction  = useNavigate();
    const location : LocationParams = useLocation()

    // Selectors
    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const totalUsersCount : number = useSelector(getTotalUsersCountSelector)
    const currentPage : number = useSelector(getCurrentPageSelector)
    const pageSize : number = useSelector(getPageSizeSelector)
    const followingInProgress : [] = useSelector(getFollowingInProgressSelector)
    const isFetching = useSelector(getIsFetchingSelector)
    const filter: FilterType = useSelector(getUsersFilterSelector)


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
        dispatch(getUsersThunkCreator(parsedCurrentPage, pageSize, parsedFilter))
    }, [])

    // Connecting the data from api with navigate to get the right url
    useEffect(() => {
        navigate(`?term=${filter.term}&friend=${filter.friend}&page=${currentPage}`)
    }, [filter, currentPage])

    //Filtration by users followed/unfollowed/all
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
                    filter={filter.friend}
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
                        {/*NAVIGATING TO THE USER PROFILE BY CLICK ON IMAGE*/}
                        <NavLink to={'/profile/' + item.id}>
                        <span><img src={item.photos.small !== null ? item.photos.small : userPhoto} className={styles.usersPhoto}/></span>
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


const UsersMemoComponent = React.memo(Users)
export default compose(
    WithAuthRedirect
)(UsersMemoComponent)



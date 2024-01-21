import React, {useEffect, useState} from 'react';
import styles from "./users.module.css";
import userPhoto from "../assets/images/louie.jpg";
import {actions, FilterType, followUserThunkCreator,  getUsersThunkCreator, unfollowUserThunkCreator, UsersComponentTypeArrays} from "../redux/UsersReducer";
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
import UsersSearchForm from "./UsersSearchForm";


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
        // debugger
        const parsed: ParsedQuery = queryString.parse(location.search)
        let parsedCurrentPage = Number(parsed.page)
        if (isNaN(parsedCurrentPage) || parsedCurrentPage <= 0) {
            parsedCurrentPage = 1;
        }
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
        dispatch(getUsersThunkCreator(parsedCurrentPage, pageSize, parsedFilter))
    }, [])

    useEffect(() => {
        navigate(`?term=${filter.term}&friend=${filter.friend}&page=${currentPage}`)
    }, [filter, currentPage])

    const onFilterChanged = (filter: FilterType) => {
        dispatch(getUsersThunkCreator(currentPage, pageSize, filter))
    }

    const handlePageChangeUsers = (pageNumber: number) => {
        dispatch(getUsersThunkCreator(pageNumber, pageSize, filter));
    };


    // console.log('location' ,  location)
    // console.log('filter' ,  filter)

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




export default compose(
    WithAuthRedirect
)(Users)




import React, {useEffect, useState} from 'react';
import styles from "./users.module.css";
import userPhoto from "../assets/images/louie.jpg";
import {FilterType, followUserThunkCreator, FormType, getUsersThunkCreator, unfollowUserThunkCreator, UsersComponentTypeArrays} from "../redux/UsersReducer";
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
        const parsed: ParsedQuery = queryString.parse(location.search)
        let parsedCurrentPage = Number(parsed.page)
        if (isNaN(parsedCurrentPage) || parsedCurrentPage <= 0) {
            parsedCurrentPage = 1;
        }


        // debugger
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
        // console.log('location' , location.search)

        // dispatch(getUsersThunkCreator(currentPage, pageSize, filter))
        dispatch(getUsersThunkCreator(parsedCurrentPage, pageSize, parsedFilter))

    }, [])


    useEffect(() => {
        // console.log('currentPage' , currentPage)
        navigate(`?term=${filter.term}&friend=${filter.friend}&page=${currentPage}`)
    }, [filter, currentPage])

    const onFilterChanged = (filter: FilterType) => {
        dispatch(getUsersThunkCreator(1, pageSize, filter))
    }

    return (
        <div>
            <Preloader isFetching={isFetching}/>
            <div>
                <UsersSearchForm
                    onFilterChanged={onFilterChanged}
                />
            </div>

            <div>
                <PaginationUsers
                    totalUsersCount={totalUsersCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
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

const usersSearchFormValidate = (values: any) => {
    const errors = {};
    return errors
}
type UsersSearchFormPropsType = {
    onFilterChanged: (filter: FilterType) => void
}

const UsersSearchForm: React.FC<UsersSearchFormPropsType> = React.memo((props) => {
    const submit = (values: FormType, {setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
        //converting the values.friends into the boolean from string "true" => true (boolean) req. by the api docs.


        const filter: FilterType = {
            term: values.term,
            friend: values.friend === 'null' ? null : values.friend === "true" ? true : false
        }
        props.onFilterChanged(filter)
        // props.onFilterChanged(values)
        setSubmitting(false)
    }


    return (<div>
        <h3>Find user</h3>
        <Formik
            initialValues={{term: '', friend: 'null'}}
            validate={usersSearchFormValidate}
            onSubmit={submit}
        >
            {({isSubmitting}) => (
                <Form>
                    <Field type="text" name="term"/>

                    <Field name="friend" as="select">
                        <option value="null">All</option>
                        <option value="true">Only followed</option>
                        <option value="false">Only unfolowwed</option>
                    </Field>

                    <button type="submit" disabled={isSubmitting}>
                        Find
                    </button>
                </Form>
            )}
        </Formik>
    </div>)
})


export default compose(
    WithAuthRedirect
)(Users)
import React, {useEffect} from 'react';
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import {FilterType, getUsersThunkCreator} from "../../redux/UsersReducer";
import PaginationUsers from "./users_pagination/PaginationUsers";
import {UsersSection} from "./UsersContainer";

type UsersDesktopPropsType = {
    pageSize: number
    filter :FilterType
    totalUsersCount : number
    currentPage :number
}

const UsersDesktop = ({pageSize, filter, totalUsersCount, currentPage}: UsersDesktopPropsType) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()

    useEffect(() => {
            dispatch(getUsersThunkCreator(currentPage, pageSize, filter))

    }, [])
    const handlePageChangeUsers = (pageNumber: number) => {
        dispatch(getUsersThunkCreator(pageNumber, pageSize, filter));
    };

    return (
        <div>
            <UsersSection/>

            <div className="pagination_section">
                <PaginationUsers
                    totalUsersCount={totalUsersCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChangeUsers}
                />
            </div>

        </div>
    )
}
export default UsersDesktop;
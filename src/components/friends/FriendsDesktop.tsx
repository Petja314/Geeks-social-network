import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import React, {useEffect} from "react";
import {setFriendListThunkCreator} from "../../redux/FriendsReducer";
import PaginationUsers from "../users/users_pagination/PaginationUsers";
import {FriendsSection} from "./FriendsContainer";


type FriendsDesktopPropsType = {
    pageSize :  number
    totalCount : number
    currentPage : number
}

const FriendsDesktop = ({totalCount, pageSize, currentPage}: FriendsDesktopPropsType) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();

    useEffect(() => {
        // getting the current users who are followed with an api request
        // debugger
        dispatch(setFriendListThunkCreator(currentPage, true));
    }, [currentPage]);

    const handlePageChangeUsers = (pageNumber: number) => {
        dispatch(setFriendListThunkCreator(pageNumber, true)); //dispatch current page
    };
    return (
        <div>

            <FriendsSection/>
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

export default FriendsDesktop



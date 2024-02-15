import React, {useEffect, useState} from 'react';
import {actionsUsers, getMobileUsersThunkCreator,} from "../../redux/UsersReducer";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import {UsersSection} from "./UsersContainer";

const UsersMobile = ({currentPage,pageSize,filter,usersPage} : any) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (fetching) {
            dispatch(getMobileUsersThunkCreator(currentPage, pageSize, filter))
                .finally(() => setFetching(false))
        }
    }, [fetching])

    const scrollHandler = async () => {
        const bottomOfPage = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
        if (bottomOfPage < 200) {
            setFetching(true)
            // dispatch(actionsUsers.setCurrentPage(currentPage+1))
        }
    };
    useEffect(() => {
        window.addEventListener("scroll", scrollHandler);
        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
    }, [scrollHandler]);

    console.log('currentPage mobile :', currentPage)
    console.log('mobile users : ', usersPage.users)
    return (
        <div style={{overflowY: "auto"}} onScroll={scrollHandler}>
            <UsersSection/>
        </div>
    );
};

export default UsersMobile;
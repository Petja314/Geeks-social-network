import React, {useEffect, useState} from 'react';
import {actionsUsers, FilterType, getMobileUsersThunkCreator, UsersComponentTypeArrays,} from "../../redux/UsersReducer";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import {useDispatch, useSelector} from "react-redux";
import {UsersSection} from "./UsersContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import {newsAPI} from "../../api/NewsAPI";
import exp from "constants";
import Preloader from "../../common/preloader/Preloader";
import {getUsersPageSelector} from "../../redux/selectors/UsersSelectors";


type UsersMobilePropsType = {
    pageSize: number
    filter :FilterType
}
const UsersMobile = ({pageSize,filter} : UsersMobilePropsType) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const [fetching, setFetching] = useState <boolean>(true)
    const [page,setPage] = useState<number>(1)

    useEffect(() => {
        if (fetching) {
            dispatch(getMobileUsersThunkCreator(page, pageSize, filter))
            setPage((prevState) => prevState+1)
            setTimeout(() => {
                setFetching(false)
            },1000)
        }
    }, [fetching])


    const scrollHandler =  () => {
        const bottomOfPage = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
        if (bottomOfPage < 200) {
            setFetching(true)
        }
    };
    useEffect(() => {
        window.addEventListener("scroll", scrollHandler);
        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
    }, [fetching]);

    return (
        <div style={{overflowY: "auto"}} onScroll={scrollHandler}>
            <UsersSection/>
            {fetching &&
                <Preloader isFetching={true}/>
            }

        </div>
    );
};
export default UsersMobile;



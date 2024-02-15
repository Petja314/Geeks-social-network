import {FriendsType, setFriendsMobileListThunkCreator} from "../../redux/FriendsReducer";
import React, {useEffect, useState} from "react";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import {useDispatch} from "react-redux";
import Preloader from "../../common/preloader/Preloader";
import FriendsDesktop from "./FriendsDesktop";
import {FriendsSection} from "./FriendsContainer";

type FriendsMobilePropsType = {
    friends :  FriendsType[]
    totalCount : number
}
const FriendsMobile = ({friends,totalCount} : FriendsMobilePropsType) => {
    const [fetching, setFetching] = useState<boolean>(true)
    const [page,setPage] = useState<number>(1)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();

    useEffect(() => {
        if (fetching) {
            dispatch(setFriendsMobileListThunkCreator(page, true));
            setPage((prevState) => prevState+1)
            setTimeout(() => {
                setFetching(false)
            },1000)
        }
    },[fetching])

    const scrollHandler  = () => {
        const bottomOfPage = document.documentElement.scrollHeight -  (window.scrollY + window.innerHeight)
        if (bottomOfPage <  200  && friends.length < totalCount) {
            setFetching(true)
        }
    }
    useEffect(() => {
        window.addEventListener('scroll' , scrollHandler)
        return  ( () => {
            return window.removeEventListener('scroll' , scrollHandler)
        })
    },[scrollHandler])

    console.log('friends :' , friends)

    return (
        <div style={{overflowY : "scroll"}}  onScroll={scrollHandler}>
            <FriendsSection/>
            {fetching &&
                <Preloader isFetching={true}/>
            }
        </div>
    )
}

export default FriendsMobile


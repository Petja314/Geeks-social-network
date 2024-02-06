import React, {useEffect} from 'react';
import {connect, useDispatch, useSelector} from "react-redux";
import Users from "./Users";
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
type UsersPagePropsType = {

}
const UsersPage : React.FC<UsersPagePropsType> = () => {
    const isFetching = useSelector(getIsFetchingSelector)
    const dispatch : any = useDispatch()
    const currentPage = useSelector(getCurrentPageSelector)
    const pageSize = useSelector(getPageSizeSelector)
    const filter : FilterType = useSelector(getUsersFilterSelector)


    useEffect(() => {
        dispatch(getUsersThunkCreator(currentPage, pageSize,filter))
    },[])

    return <>
        <div>
            <Preloader isFetching={isFetching}/>
            <Users
            />
        </div>
    </>
}

export default compose(
    WithAuthRedirect
)(UsersPage)



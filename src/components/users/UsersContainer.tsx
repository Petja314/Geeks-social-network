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
import {stat} from "fs";
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



// class UsersAPIComponent extends React.Component<any, any> {
//     componentDidMount() {
//         this.props.getUsersThunkCreator(this.props.currentPage, this.props.pageSize,this.props.filter)
//     }
//
//     // onPageChange = (pageNumber: number) => {
//     //     this.props.getUsersThunkCreator(pageNumber, this.props.pageSize,this.props.filter)
//     // }
//
//     // onFilterChanged = (filter : FilterType) => {
//     //     this.props.getUsersThunkCreator(1, this.props.pageSize,filter)
//     // }
//
//     render() {
//         console.log('follow', this.props.follow)
//         return (
//             <div>
//                 <Preloader isFetching={this.props.isFetching}/>
//                 <Users
//                     // totalUsersCount={this.props.totalUsersCount}
//                     // pageSize={this.props.pageSize}
//                     // currentPage={this.props.currentPage}
//                     // onPageChange={this.onPageChange}
//                     // usersPage={this.props.usersPage}
//                     // follow={this.props.follow}
//                     // unfollow={this.props.unfollow}
//                     // followingInProgress={this.props.followingInProgress}
//                     // setFollowingProgress={this.props.setFollowingProgress}
//                     // unfollowUserThunkCreator={this.props.unfollowUserThunkCreator}
//                     // followUserThunkCreator={this.props.followUserThunkCreator}
//                     // onFilterChanged={this.onFilterChanged}
//                 />
//             </div>
//         );
//     }
// }
//
// export type UsersPageProps = {
//     usersPage: UsersComponentTypeArrays,
//     pageSize: number,
//     totalUsersCount: number,
//     currentPage: number,
//     isFetching: boolean,
//     // followingInProgress: boolean
//     filter : FilterType
// }
// type MapDispatch = {
//     getUsersThunkCreator: (currentPage: number, pageSize: number,  filter : FilterType) => void,
//     // unfollowUserThunkCreator: (id: number) => void,
//     // followUserThunkCreator : (id : number) => void,
// }
//
// let mapStateToProps = (state: any): UsersPageProps => {
//     return {
//         usersPage: getUsersPageSelector(state),
//         pageSize: getPageSizeSelector(state),
//         totalUsersCount: getTotalUsersCountSelector(state),
//         currentPage: getCurrentPageSelector(state),
//         isFetching: getIsFetchingSelector(state),
//         // followingInProgress: getFollowingInProgressSelector(state),
//         filter : getUsersFilterSelector(state)
//     }
// }
//
// export default compose(
//     connect<UsersPageProps,MapDispatch>(mapStateToProps, {
//         getUsersThunkCreator,
//         // unfollowUserThunkCreator,
//         // followUserThunkCreator,
//     }),
//     WithAuthRedirect
// )(UsersAPIComponent)
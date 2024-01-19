import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentPageSelector, getFollowingInProgressSelector, getPageSizeSelector, getTotalUsersCountSelector, getUsersFilterSelector, getUsersPageSelector} from "../redux/UsersSelectors";
import {FilterType, getUsersThunkCreator, unfollowUserThunkCreator, UsersArrayType, UsersComponentTypeArrays} from "../redux/UsersReducer";
import PaginationUsers from "../users/PaginationUsers";
import userPhoto from "../assets/images/louie.jpg";
import styles from "../users/users.module.css";
import {FriendsListStateType,  setFriendListThunkCreator} from "../redux/FriendsReducer";

const Friends = () => {
    const dispatch: any = useDispatch();
    const followingInProgress = useSelector(getFollowingInProgressSelector)

    const { friends, totalCount, pageSize, currentPage }: FriendsListStateType = useSelector(
        (state: any) => state.friendPage
    );

    useEffect(() => {
        dispatch(setFriendListThunkCreator(currentPage,true));
    }, []);

    const handlePageChangeUsers = (pageNumber: number ) => {
        dispatch(setFriendListThunkCreator(pageNumber, true)); //dispatch current page
    };



    console.log('totalCount : ', totalCount)
    console.log('friends  : ', friends)
    console.log('currentPage  : ', currentPage)

    return (
        <div>
            <h2>List of friends</h2>

            {friends.map((item : any) => (
                <div key={item.id}>
                    <span>
                        {item.followed  &&
                            <div>
                                <div><img src={item.photos.small !== null ? item.photos.small : userPhoto} className={styles.usersPhoto}/></div>
                                <div>{item.name}</div>
                                <button disabled={followingInProgress.some((id: number) => id === item.id)} onClick={() => {
                                    dispatch(unfollowUserThunkCreator(item.id))
                                }}>Unfollow
                                </button>
                            </div>


                        }
                    </span>

                </div>
            ))}

                <div>
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
export default Friends


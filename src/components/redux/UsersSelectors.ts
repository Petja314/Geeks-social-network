import {createSelector} from "reselect";

const getUsersPage = (state : any) => state.usersPage;

export const getUsersPageSelector = createSelector(
    [getUsersPage],
    (usersPage) => usersPage
);

export const getPageSizeSelector = createSelector(
    [getUsersPage],
    (usersPage) => usersPage.pageSize
);

export const getTotalUsersCountSelector = createSelector(
    [getUsersPage],
    (usersPage) => usersPage.totalUsersCount
);

export const getCurrentPageSelector = createSelector(
    [getUsersPage],
    (usersPage) => usersPage.currentPage
);

export const getIsFetchingSelector = createSelector(
    [getUsersPage],
    (usersPage) => usersPage.isFetching
);

export const getFollowingInProgressSelector = createSelector(
    [getUsersPage],
    (usersPage) => usersPage.followingInProgress
);
export const getUsersFilterSelector = createSelector(
    [getUsersPage],
    (usersPage) => usersPage.filter
);

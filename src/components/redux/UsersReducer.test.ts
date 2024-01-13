import usersReducer, {actions, UsersComponentTypeArrays} from "./UsersReducer";

let state : any
beforeEach(() => {
     state = {
        users: [
            {
                id: 0, name: 'Dima 1', followed: false,
                photos: {small: null, large: null},
                status: 0
            },            {
                id: 1, name: 'Dima 2', followed: false,
                photos: {small: null, large: null},
                status: 1
            },            {
                id: 2, name: 'Dima 3', followed: true,
                photos: {small: null, large: null},
                status: 2
            },            {
                id: 3, name: 'Dima 4', followed: true,
                photos: {small: null, large: null},
                status: 3
            },
        ],
        pageSize: 5,
        totalUsersCount: 0,
        currentPage: 1,
        isFetching: false,
        followingInProgress: []
    }

})

test("follow success", () => {
        const newState = usersReducer(state, actions.follow(1) )
    expect(newState.users[0].followed).toBeFalsy()
    expect(newState.users[1].followed).toBeTruthy()

})
test("unfollow success", () => {
        const newState = usersReducer(state, actions.unfollow(3) )
    expect(newState.users[2].followed).toBeTruthy()
    expect(newState.users[3].followed).toBeFalsy()

})
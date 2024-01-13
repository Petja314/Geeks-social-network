import {actions, followUserThunkCreator} from "./UsersReducer";
import {usersAPI} from "../../api/UsersAPI";
import {ResponseType, ResultCodesEnum} from "../../api/Api";

jest.mock("../../api/UsersAPI")
const useAPIMock = usersAPI

const result : ResponseType = {
    resultCode : ResultCodesEnum.Success,
    messages : [],
    data : {}
}
// @ts-ignore

test("success follow thunk" , async () => {

    // useAPIMock.followUser.mockReturnValue(result)
    const thunk = followUserThunkCreator(1)
    const dispatchMock = jest.fn()
    const getStateMock = jest.fn()

    await thunk(dispatchMock,getStateMock,{})

    expect(dispatchMock).toBeCalledTimes(2)
    expect(dispatchMock).toHaveBeenCalledWith(1, actions.setToggleFetching(true))

})
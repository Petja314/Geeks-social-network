import React, {useEffect} from 'react';
import {compose, Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {getStatusThunkCreator, ProfileDataType, ProfileStateTypes, usersProfileAuthThunkCreator} from "../../redux/ProfileReducer";
import ProfileInfo from "./ProfileInfo";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import MyPostsContainer from "../myposts/MyPostsContainer";
import {RootState} from "../../redux/Redux-Store";

type QuizParams = {
    id: string | undefined
};
const ProfileContainerFunc = () => {
    const dispatch: Dispatch = useDispatch()

    //Extracting user ID from the URL params
    const {id} = useParams<QuizParams>()

    // Accessing user profile and status from the Redux store
    const profile = useSelector((state : any) => state.profilePage.profile);
    const status  = useSelector((state: any) => state.profilePage.status)
    const authorizedUserId  : number | null = useSelector((state: RootState) => state.userAuthPage.userId)


    // Fetching user profile data and status based on the ID from the URL
    // If no ID provided, the default ID would be authorizedUserId (my ID)
    useEffect(() => {
        let userId: number | null = Number(id)
        if (!userId) {
            userId = authorizedUserId
        }
        dispatch(usersProfileAuthThunkCreator(userId))
        dispatch(getStatusThunkCreator(userId))
    }, [id, authorizedUserId])
    return (
        <div>
            <ProfileInfo
                isOwner={!id}
                profile={profile}
                status={status}
            />
            <MyPostsContainer/>

        </div>
    );
};

const ProfileMemoComponent = React.memo(ProfileContainerFunc)
export default compose(
    WithAuthRedirect
)(ProfileMemoComponent)



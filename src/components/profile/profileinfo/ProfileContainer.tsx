import React, {useEffect} from 'react';
import {compose, Dispatch} from "redux";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {getStatusThunkCreator, ProfileDataType, ProfileStateTypes, usersProfileAuthThunkCreator} from "../../../redux/ProfileReducer";
import ProfileInfo from "./ProfileInfo";
import {WithAuthRedirect} from "../../../hoc/WithAuthRedirect";
import MyPostsContainer from "../myposts/MyPostsContainer";
import {RootState} from "../../../redux/Redux-Store";
import {ThunkDispatch} from "redux-thunk";
import UsersPostsUnverified from "../myposts/usersposts/UsersPostsUnverified";
import Preloader from "../../../common/preloader/Preloader";

type QuizParams = {
    id: string | undefined
};
const ProfileContainer = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    //Extracting user ID from the URL params
    const {id} = useParams<QuizParams>()
    const {profile, status}: ProfileStateTypes = useSelector((state: RootState) => state.profilePage)
    const authorizedUserId: number | null = useSelector((state: RootState) => state.userAuthPage.userId)
    // console.log('id' , authorizedUserId)
    // console.log('profile', profile.fullName)

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

    // if (status === "") return <div>loading...</div>
    // console.log('profile container status :' , status)
    return (
        <div>

            <ProfileInfo
                userId={profile.userId}
                isOwner={!id}
                profile={profile}
                status={status}
            />

            {/*SHOWING THE POSTS WITH FULL FUNCTIONAL IF USER AUTHORIZED , IF NOT THEN ONLY POSTS FOR VISABILITY!*/}
            {!id ? <MyPostsContainer/> : <UsersPostsUnverified idUserURL={Number(id)}/>
            }

        </div>
    );
};

const ProfileMemoComponent = React.memo(ProfileContainer)
export default compose(
    WithAuthRedirect
)(ProfileMemoComponent)



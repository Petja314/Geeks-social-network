import React, {ChangeEvent, useState} from "react";
import Preloader from "../../common/preloader/Preloader";
import ProfileStatus from "./ProfileStatus"
import userPhoto from "../../assets/images/louie.jpg"
import 'filepond/dist/filepond.min.css';
import {ActionsProfileTypes, ProfileDataType, ProfileStateTypes, savePhotoThunk} from "../../redux/ProfileReducer";
import {useDispatch} from "react-redux";
import {ProfileEditForm} from "./ProfileEditForm";
import ProfileData from "./ProfileData";
import {Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";
import UserAvatarPhoto from "../../users/UserAvatarPhoto";

export type ProfileInfoPropsType = {
    isOwner: boolean
    profile : ProfileDataType
    status : string | null
    userId : any
}
const ProfileInfo = (props: ProfileInfoPropsType) => {
    const dispatch : any = useDispatch()
    //Track form Edit Form state
    const [editMode, setEditMode] = useState<boolean>(false)

    //If profile data is not received , show Preloader
    if (!props.profile) {
        return <Preloader isFetching/>
    }

    //Send selected photo to reducer
    const onMainPhotoSelected = (event : ChangeEvent<HTMLInputElement>) => {
        let files = event.target?.files
        if (files) {
            dispatch(savePhotoThunk(files[0]))
        }
    }
    // console.log('PROFILE INFO : ' , props.status)

    return (
        <div>
            {/*<img style={{"width": "15%"}} src={props.profile.photos.small || userPhoto} alt=""/>*/}
            <UserAvatarPhoto photos={props.profile.photos.small} />


            {props.isOwner && <input type={"file"} onChange={onMainPhotoSelected}/>}
            <ProfileStatus
                userId={props.userId}
                status={props.status}
                isOwner={props.isOwner}
            />

            {/*Show User Data Form depends on edit mode state*/}
            {editMode
                ? <ProfileEditForm
                    initialValues={props.profile}
                    isOwner={props.isOwner}
                    setEditMode={setEditMode}
                />
                : <ProfileData
                    profile={props.profile}
                    isOwner={props.isOwner}
                    activateEditMode={() => {
                        setEditMode(true)
                    }}
                />}

        </div>
    )
}

const ProfileInfoMemoComponent = React.memo(ProfileInfo)

export default ProfileInfoMemoComponent

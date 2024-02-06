import React, {ChangeEvent, useState} from "react";
import Preloader from "../../../common/preloader/Preloader";
import ProfileStatus from "./ProfileStatus"
import 'filepond/dist/filepond.min.css';
import {ActionsProfileTypes, ProfileDataType, ProfileStateTypes, savePhotoThunk} from "../../../redux/ProfileReducer";
import {useDispatch} from "react-redux";
import {ProfileEditForm} from "./ProfileEditForm";
import ProfileData from "./ProfileData";
import UserAvatarPhoto from "../../users/UserAvatarPhoto";
import "../../../css/profile_info.css"
import "../../../css/profile_edit.css"


export type ProfileInfoPropsType = {
    isOwner: boolean
    profile: ProfileDataType
    status: string | null
    userId: any
}
const ProfileInfo = (props: ProfileInfoPropsType) => {
    const dispatch: any = useDispatch()
    //Track form Edit Form state
    const [editMode, setEditMode] = useState<boolean>(false)

    //If profile data is not received , show Preloader
    if (!props.profile) {
        return <Preloader isFetching/>
    }

    //Send selected photo to reducer
    const onMainPhotoSelected = (event: ChangeEvent<HTMLInputElement>) => {
        let files = event.target?.files
        if (files) {
            dispatch(savePhotoThunk(files[0]))
        }
    }
    // console.log('PROFILE INFO : ' , props.status)

    return (
        <div className="profile_container">
            {/*<img style={{"width": "15%"}} src={props.profile.photos.small || userPhoto} alt=""/>*/}
            <h1 className="profile_page_title">PROFILE PAGE</h1>


            <div className="profile_wrapper">
                <h1 className="about_me_title">DEVELOPER INFORMATION</h1>
                <div className="profile_edit_container">


                    <div className="profile_avatar_container">
                        <span className="avatar_title">  YOUR AVATAR  </span>
                        <UserAvatarPhoto photos={props.profile.photos.small}/>
                        <div className="select_photo">
                            {props.isOwner && <input type={"file"} onChange={onMainPhotoSelected}/>}
                        </div>
                        <span className="avatar_title">
                    NAME:{props.profile.fullName}
                            <ProfileStatus
                                userId={props.userId}
                                status={props.status}
                                isOwner={props.isOwner}
                            />
                        </span>
                    </div>


                    <div className="profile_data_container">
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


                    {/*Show User Data Form depends on edit mode state*/}

                </div>

            </div>
        </div>
    )
}

const ProfileInfoMemoComponent = React.memo(ProfileInfo)

export default ProfileInfoMemoComponent

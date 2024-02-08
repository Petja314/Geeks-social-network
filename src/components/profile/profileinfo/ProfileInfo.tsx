import React, {ChangeEvent, useState} from "react";
import Preloader from "../../../common/preloader/Preloader";
import ProfileStatus from "./ProfileStatus"
import 'filepond/dist/filepond.min.css';
import {ActionsProfileTypes, ProfileDataType, ProfileStateTypes, savePhotoThunk} from "../../../redux/ProfileReducer";
import {useDispatch, useSelector} from "react-redux";
import {ProfileEditForm} from "./ProfileEditForm";
import ProfileData from "./ProfileData";
import UserAvatarPhoto from "../../users/UserAvatarPhoto";
import "../../../css/profile_edit.css"
import DragPhoto from "../../drag_drop_img/DragPhoto";
import {isDraggingAC} from "../../drag_drop_img/DragReducer";


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
    const onDropHandler = (event: any) => {
        event.preventDefault()
        let files = [...event.dataTransfer.files]
        if (files) {
            dispatch(savePhotoThunk(files[0]))
        }
        dispatch(isDraggingAC(false))
    }


    return (
        <div className="component_page">
            {/*<img style={{"width": "15%"}} src={props.profile.photos.small || userPhoto} alt=""/>*/}
            <h2>PROFILE</h2>

            <div className="profile_wrapper">
                <h3 className="about_me_title">DEVELOPER INFORMATION</h3>
                <div className="profile_edit_container">
                    <div className="profile_avatar_container">
                        <span className="avatar_title">  YOUR AVATAR  </span>
                        <UserAvatarPhoto photos={props.profile.photos.small}/>

                        <div className="photo_input_section">
                            <DragPhoto
                                onDropHandler={onDropHandler}
                            />
                        </div>
                        <div>
                            {props.isOwner && <input className="custom-file-input" type={"file"} onChange={onMainPhotoSelected}/>}
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

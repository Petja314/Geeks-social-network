import React, {ChangeEvent, useState} from "react";
import Preloader from "../../../common/preloader/Preloader";
import ProfileStatus from "./ProfileStatus"
import 'filepond/dist/filepond.min.css';
import { ProfileDataType, savePhotoThunk} from "../../../redux/ProfileReducer";
import {useDispatch} from "react-redux";
import {ProfileEditForm} from "./ProfileEditForm";
import ProfileData from "./ProfileData";
import UserAvatarPhoto from "../../users/UserAvatarPhoto";
import "../../../css/profile/profile_edit.css"
import DragPhoto from "../../drag_drop_img/DragPhoto";
import {isDraggingAC} from "../../drag_drop_img/DragReducer";
import {TypingEffects} from "../../openAi/typing-effect";


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
            // console.log("files[0]" , files[0])
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
        <div className="profile_container">
            {/*<img style={{"width": "15%"}} src={props.profile.photos.small || userPhoto} alt=""/>*/}
            <h2>PROFILE</h2>

            <div className="profile_section">

                <h3 className="about_me_title"> <TypingEffects text={"DEVELOPER INFORMATION"} speed={50}/> </h3>

                <div className="profile_info_section">
                    <div className="profile_avatar_container">
                        <h3>  YOUR AVATAR  </h3>
                        <div className="profile_avatar_img" >
                            <UserAvatarPhoto photos={props.profile.photos.large}/>
                        </div>

                            {props.isOwner &&
                                <div >
                                    <div className="photo_input_section">
                                        <DragPhoto
                                            onDropHandler={onDropHandler} />
                                    </div>
                                    <input className="custom-file-input" type={"file"} onChange={onMainPhotoSelected}/>
                                </div>
                                }
                        <span className="profile_user_name" >
                         NAME : {props.profile.fullName}
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

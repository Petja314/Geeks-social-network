import React from "react";
import ProfileContactsForm from "./ProfileContactsForm";
import {ContactsType, ProfileDataType} from "../../../redux/ProfileReducer";

type ProfileDataPropsType = {
    isOwner: boolean
    profile: ProfileDataType
    activateEditMode: () => void
}
const ProfileData = (props: ProfileDataPropsType) => {
    return <div>
        <h3 className="contact_form_title">ABOUT ME </h3>
        <div className="profile_about_me_section">


            <div className="profile_user_info_section">

                <div className="profile_list_section">
                <ul >
                    <div>User Info #</div>
                    <li><span>Full name: </span> {props.profile.fullName} </li>
                    <li><span>Am I looking for a job?</span> {props.profile.lookingForAJob ? "yes" : "no"} </li>
                    {props.profile.lookingForAJob &&
                        <li><span>My professional skills</span> {props.profile.lookingForAJobDescription} </li>
                    }
                    <li><span>About me: </span> {props.profile.aboutMe}</li>
                </ul>
                </div>
            </div>


            <div className="contacts_list_section">
                <span>Contacts # </span>
                {Object.keys(props.profile.contacts).map((key) => {
                    const contactKey = key as keyof ContactsType; // Type assertion
                    return (
                        <ProfileContactsForm
                            key={key}
                            contactTitle={key}
                            contactValue={props.profile.contacts[contactKey]}
                        />
                    );
                })}
            </div>
        </div>

        {/*We can change the Profile only when user is Authorized! isOwner => change data */}
        <div className="edit_form_btn_section">
            {props.isOwner && <div>
                <button onClick={props.activateEditMode}>Edit Contact Information</button>
            </div>}

        </div>


    </div>
}
const ProfileDataMemoComponent = React.memo(ProfileData)

export default ProfileDataMemoComponent
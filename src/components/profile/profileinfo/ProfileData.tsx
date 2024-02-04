import React from "react";
import ProfileContactsForm from "./ProfileContactsForm";
import {ContactsType, ProfileDataType} from "../../../redux/ProfileReducer";

type ProfileDataPropsType = {
    isOwner: boolean
    profile: ProfileDataType
    activateEditMode: () => void
}
const ProfileData = (props: ProfileDataPropsType) => {
    return <>
        {/*We can change the Profile only when user is Authorized! isOwner => change data */}
        {props.isOwner && <div>
            <button onClick={props.activateEditMode}>Edit</button>
        </div>}

        <ul style={{"listStyle": "none"}}>
            <li> {`Full name :  ${props.profile.fullName}`} </li>
            <li> {`Am I looking for a job? :  ${props.profile.lookingForAJob ? "yes" : "no"}`} </li>
            {props.profile.lookingForAJob &&
                <li> {`My professional skills:  ${props.profile.lookingForAJobDescription}`} </li>
            }
            <li> {` About me :  ${props.profile.aboutMe}`}</li>

            {/*<li>Contacts:{Object.keys(props.profile.contacts).map(key => {*/}
            {/*    return <ProfileContactsForm key={key} contactTitle={key}  contactValue={props.profile.contacts[key]}/>*/}
            {/*})} </li>*/}
            <li>
                Contacts:
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
            </li>

        </ul>
    </>
}
const ProfileDataMemoComponent = React.memo(ProfileData)

export default ProfileDataMemoComponent
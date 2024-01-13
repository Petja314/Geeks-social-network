import React from "react";

export type ContactPropsType = {
    contactTitle: string
    contactValue : null | string
}
//Social media contacts
export const ProfileContactsForm = (props: ContactPropsType) => {
    return <>
        <div>
            <b>{props.contactTitle}</b> : {props.contactValue}
        </div>

    </>
}

const ProfileContactsMemoComponent = React.memo(ProfileContactsForm)

export default ProfileContactsMemoComponent;
import React from "react";

export type ContactPropsType = {
    contactTitle: string
    contactValue : null | string
}
//Social media contacts
export const ProfileContactsForm = (props: ContactPropsType) => {
    // console.log('title' , props.contactTitle)
    return <>
        <div className="contacts_form_list" >
          <span > {props.contactTitle} : </span>{props.contactValue}
        </div>

    </>
}

const ProfileContactsMemoComponent = React.memo(ProfileContactsForm)

export default ProfileContactsMemoComponent;
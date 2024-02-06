import React from 'react';
import user_avatar_1 from "../../assets/images/user_avatar_img/user_1.gif";
import user_avatar_2 from "../../assets/images/user_avatar_img/user_2.gif";
import user_avatar_3 from "../../assets/images/user_avatar_img/user_3.gif";
import user_avatar_4 from "../../assets/images/user_avatar_img/user_4.gif";
import user_avatar_5 from "../../assets/images/user_avatar_img/user_5.gif";
import user_avatar_6 from "../../assets/images/user_avatar_img/user_6.gif";
import user_avatar_7 from "../../assets/images/user_avatar_img/user_7.gif";
import user_avatar_8 from "../../assets/images/user_avatar_img/user_8.gif";
import user_avatar_9 from "../../assets/images/user_avatar_img/user_9.gif";
import user_avatar_10 from "../../assets/images/user_avatar_img/user_10.gif";
import user_avatar_11 from "../../assets/images/user_avatar_img/user_11.gif";
import user_avatar_12 from "../../assets/images/user_avatar_img/user_12.gif";
import user_avatar_13 from "../../assets/images/user_avatar_img/user_13.gif";
import user_avatar_14 from "../../assets/images/user_avatar_img/user_14.gif";
import user_avatar_15 from "../../assets/images/user_avatar_img/user_15.gif";
import user_avatar_16 from "../../assets/images/user_avatar_img/user_15.gif";
import user_avatar_17 from "../../assets/images/user_avatar_img/user_15.gif";
import user_avatar_18 from "../../assets/images/user_avatar_img/user_15.gif";
import user_avatar_19 from "../../assets/images/user_avatar_img/user_15.gif";
import user_avatar_20 from "../../assets/images/user_avatar_img/user_15.gif";
import styles from "./users.module.css";
import "../../css/profile_info.css"

const UserAvatarPhoto = (props: any) => {
    const user_images = [
        user_avatar_1, user_avatar_2, user_avatar_3, user_avatar_4, user_avatar_5, user_avatar_6, user_avatar_7, user_avatar_8, user_avatar_9, user_avatar_10, user_avatar_11, user_avatar_12, user_avatar_13, user_avatar_14, user_avatar_15, user_avatar_16, user_avatar_17, user_avatar_18, user_avatar_19, user_avatar_20
    ]

    return (
        <div className="avatar_img">
            {props.photos !== null ? (<span>
            <img className={styles.usersPhoto} src={props.photos} alt=""/>
                </span>
            ) : (
                <span>
            {/*<div> photo doesn't exist.</div> looking for an avatar :*/}
           <div>
               <img className={styles.usersPhoto} src={user_images[Math.floor(Math.random() * user_images.length)]} alt=""/>
           </div>
            </span>
            )
            }
        </div>
    );
};

export default UserAvatarPhoto;
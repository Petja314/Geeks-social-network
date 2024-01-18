import React, {ChangeEvent, useEffect, useState} from 'react';
import {log} from "util";

import {profileAPI} from "../../../api/ProfileAPI";
import {useDispatch, useSelector} from "react-redux";
import {updateStatusThunkCreator} from "../../redux/ProfileReducer";
import {Dispatch} from "redux";

type ProfileStatusPropsType = {
    status :  string
}
const ProfileStatus = (props: ProfileStatusPropsType) => {
    const dispatch : any = useDispatch()
    //Status state mode true/false
    const [editMode, setEditMode] = useState<boolean>(false)
    //Current state status
    const [status, setStatus] = useState<string>(props.status)

    //Get new value for a status
    const onChangeStatusHandler = (event : ChangeEvent<HTMLInputElement> ) => {
        let statusCurrentValue = event.currentTarget.value
        setStatus(statusCurrentValue)
    }
    //Start change status
    const activateEditMode = () => {
        setEditMode(true)
    }


    // When status has changed => send it to reducer to update state
    const deactivateEditMode = async () => {
        setEditMode(false)
      await dispatch(updateStatusThunkCreator(status))
    }
    const handleKeyDown = async (event : any) => {
        if (event.key === 'Enter' && event.currentTarget.blur()) {
            console.log('Enter key pressed! Save logic goes here.');
            setEditMode(false)
            await dispatch(updateStatusThunkCreator(status))
        }
    };
    return (

        <div>

            {!editMode &&
                <div >
                    <span>status : </span>
                    <span onDoubleClick={activateEditMode}   style={{fontWeight: "bold"}} >{status || "NO STATUS"}</span>
                </div>
            }

            {editMode &&
                <div>
                    <input
                        onChange={onChangeStatusHandler}
                        autoFocus={true}
                        onBlur={deactivateEditMode}
                        value={status}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    />
                </div>
            }
        </div>
    );
};

export default ProfileStatus;
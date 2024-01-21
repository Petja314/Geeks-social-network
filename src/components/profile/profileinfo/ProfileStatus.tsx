import React, {ChangeEvent, useEffect, useState} from 'react';
import {log} from "util";
import {profileAPI} from "../../../api/ProfileAPI";
import {useDispatch, useSelector} from "react-redux";
import {ActionsProfileTypes, ProfileStateTypes, updateStatusThunkCreator} from "../../redux/ProfileReducer";
import {Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";




type ProfileStatusPropsType = {
    status: string,
    isOwner: boolean
    userId : any
}
const ProfileStatus = (props: ProfileStatusPropsType) => {
    const dispatch: any = useDispatch()
    //Status state mode true/false
    const [editMode, setEditMode] = useState<boolean>(false)
    //Current state status
    const [localStatus, setLocalStatus] = useState<string>(props.status)

    //The local status is updated whenever the status prop changes, to prevent re-render previous status!
    useEffect(() => {
        setLocalStatus(props.status)
    },[props.status])

    //Get new value for a status
    const onChangeStatusHandler = (event: ChangeEvent<HTMLInputElement>) => {
        let statusCurrentValue = event.currentTarget.value
        setLocalStatus(statusCurrentValue)
    }
    //Start change status
    const activateEditMode = () => {
        setEditMode(true)
        if (!props.isOwner) {
            setEditMode(false)
        }
    }


    // When status has changed => send it to reducer to update state
    const deactivateEditMode = () => {
        setEditMode(false)
        dispatch(updateStatusThunkCreator(localStatus))
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log('Enter key pressed! Save logic goes here.');
            setEditMode(false)
            dispatch(updateStatusThunkCreator(localStatus))
        }
    };


    return (
        <div>

            {!editMode &&
                <div>
                    <span>status : </span>
                    <span onDoubleClick={activateEditMode} style={{fontWeight: "bold"}}>{localStatus || "NO STATUS"}</span>
                </div>
            }

            {editMode &&
                <div>
                    <input
                        onChange={onChangeStatusHandler}
                        autoFocus={true}
                        onBlur={deactivateEditMode}
                        value={localStatus}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    />
                </div>
            }
        </div>
    );
};

export default ProfileStatus;
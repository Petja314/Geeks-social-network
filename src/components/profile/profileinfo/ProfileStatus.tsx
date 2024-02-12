import React, {ChangeEvent, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import { updateStatusThunkCreator} from "../../../redux/ProfileReducer";

type ProfileStatusPropsType = {
    status: string | null,
    isOwner: boolean
    userId : any
}
const ProfileStatus = (props: ProfileStatusPropsType) => {
    const dispatch: any = useDispatch()
    //Status state mode true/false
    const [editMode, setEditMode] = useState<boolean>(false)
    //Current state status
    const [localStatus, setLocalStatus] = useState<any>(props.status)

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

    // console.log('ProfileStatus' , props.status)
    return (
        <div className="status_container">
            {!editMode &&
                <div>
                    <div>status :
                        <span onDoubleClick={activateEditMode} style={{fontWeight: "bold"}}> {localStatus || "NO STATUS"}</span>
                    </div>
                </div>
            }
            {editMode &&
                <div >
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
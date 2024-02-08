import React from 'react';
import "../../css/profile_edit.css"
import {useDispatch, useSelector} from "react-redux";
import {DragStateType, isDraggingAC} from "./DragReducer";
import {RootState} from "../../redux/Redux-Store";
import "../../css/photo_drag_drop/drag_and_drop.css"
import {Dispatch} from "redux";



type DragPhotoPropsType = {
    onDropHandler : (event : any) => void
}
const DragPhoto = (props : DragPhotoPropsType) => {
    const dispatch : Dispatch = useDispatch()
    const isDragging  : DragStateType = useSelector((state : RootState) => state.dragReducer.isDragging)

    const dragLeaveHandler = (event : React.DragEvent) => {
        event.preventDefault()
        dispatch(isDraggingAC(false))
    }
    const dragStartHandler = (event : React.DragEvent) => {
        event.preventDefault()
        dispatch(isDraggingAC(true))
    }

    return (
        <div>
            {isDragging ? <div className="drop_area"
                         onDragStart={event  => {dragStartHandler(event) }}
                         onDragLeave={event => {dragLeaveHandler((event))}}
                         onDragOver={event  => {dragStartHandler(event)}}
                         onDrop={event  => {props.onDropHandler(event)}}
            >
                Drop files
            </div> : <div

                onDragStart={event  => {dragStartHandler(event) }}
                onDragLeave={event => {dragLeaveHandler((event))}}
                onDragOver={event => {dragStartHandler(event)}}
            >
                Drag and drop files
            </div>
            }
        </div>
    );
};

export default DragPhoto;
export type DragStateType = {
    isDragging : boolean
}

const initialState : DragStateType = {
    isDragging : false
}
export const DragReducer = (state = initialState, action : any ) => {
    switch (action.type) {
        case "SET_DRAG" :
        return {
            ...state ,
            isDragging : action.value
        }
        default : return state
    }
}
export const isDraggingAC = (value : boolean) : {type : string ,value : boolean}  => ({
    type : "SET_DRAG",
    value : value
})





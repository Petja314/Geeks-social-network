import React from 'react';
import UsersSearchForm from "../users/UsersSearchForm";
import UserAvatarPhoto from "../users/UserAvatarPhoto";
import {NavLink} from "react-router-dom";
import {actionsDialogs, DialogsArrayType, DialogsStateTypes, fetchDialogsThunk, startChatThunk} from "../redux/DialogsReducer";
import {useDispatch, useSelector} from "react-redux";
import {FilterType, getUsersThunkCreator, UsersComponentTypeArrays} from "../redux/UsersReducer";
import {getUsersPageSelector} from "../redux/UsersSelectors";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../redux/Redux-Store";

type RecentDialogsPropsType = {
    dialogs : DialogsArrayType[],
    newMessageCount :  number,
    pageSize :  number,
    currentDialogsPage :  number,
    filter: {
        term: string,
        friend: null | boolean
    },
    pageSizeDialogs :  number
}

const RecentDialogs: React.FC<RecentDialogsPropsType> = ({dialogs, newMessageCount, pageSize, currentDialogsPage, filter, pageSizeDialogs}) => {
    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const scrollDialogsHandler = (event:  React.UIEvent<HTMLDivElement>) => {
        const elementDialogs  = event.currentTarget as HTMLDivElement;
        const bottomOfPage: number = elementDialogs.scrollHeight - (elementDialogs.scrollTop + elementDialogs.clientHeight)
        const topOfPage : number = elementDialogs.scrollTop
        //DOWN ++
        if (bottomOfPage === 0) {
            const nextPage = currentDialogsPage + 1
            dispatch(actionsDialogs.setCurrentDialogsPageAction(nextPage))
            dispatch(getUsersThunkCreator(nextPage, pageSize, filter));
            elementDialogs.scrollTop = 700
        }
        //UP --
        if (currentDialogsPage > 1 && topOfPage === 0) {
            const prevPage: number = currentDialogsPage - 1
            dispatch(actionsDialogs.setCurrentDialogsPageAction(prevPage))
            dispatch(getUsersThunkCreator(prevPage, pageSize, filter));
            elementDialogs.scrollTop = 20
        }
    }

    //Filter recent dialogs and users to find or start flood_chat
    const onFilterChanged = (filter: FilterType) => {
        // debugger
        filter = {...filter, friend: null, term: filter.term}
        dispatch(getUsersThunkCreator(1, pageSize, filter))
        if (filter.term) { //We are searching dialogs locally , because api did not provide req. data
            const filterDialogs = dialogs.filter((dialogs: any) => dialogs.userName.includes(filter.term))
            console.log('user found')
            dispatch(actionsDialogs.setAllDialogsAction(filterDialogs))
        } else {
            console.log('user not found')
            dispatch(fetchDialogsThunk())
        }
        if (filter.term === "") {
            dispatch(actionsDialogs.setCurrentDialogsPageAction(1))
        }
    };



    let pagesCount = Math.ceil(dialogs.length / pageSizeDialogs)
    const startIndex = (currentDialogsPage - 1) * pageSizeDialogs
    const endIndex = startIndex + pageSizeDialogs
    const displayedDialogs = dialogs.slice(startIndex, endIndex)
    return (
        <div>

            <div>
                <div
                    onScroll={scrollDialogsHandler}
                    style={{
                        border: "1px solid black", height: "500px", width: "350px", overflowY: "auto", paddingLeft: "50px"
                    }}
                >
                    <div className="sticky">
                        <div>
                            <UsersSearchForm onFilterChanged={onFilterChanged}/>
                        </div>
                    </div>

                    <div>

                    {/*LIST OF DIALOGS*/}
                        {displayedDialogs
                            .sort((a: any, b: any) => b.hasNewMessages - a.hasNewMessages) //SORTING THE NEW MESSAGES FIRST
                            .map((dialog: any) => (
                                <div key={dialog.id}>
                                    <div style={{paddingTop: "10px"}}>

                                        <div><UserAvatarPhoto photos={dialog.photos.small}/></div>
                                        <div>{dialog.userName} </div>

                                        <div>
                                            < NavLink to={'/dialogs/' + dialog.id}>
                                                <button onClick={() => dispatch(startChatThunk(dialog.id, dialog.userName, dialog.photos.small))}>Start Chat</button>
                                            </NavLink>
                                        </div>
                                        <hr style={{marginTop: "10px"}}/>
                                    </div>

                                    {dialog.hasNewMessages && newMessageCount > 0 ? <div style={{color: "red"}}>
                                        You got {dialog.newMessagesCount} new message
                                    </div> : <div></div>
                                    }
                                </div>
                            ))}
                        {/*LIST OF USERS*/}
                        {
                            usersPage.users.map((item: any) =>
                                <div key={item.id}>
                                    <div style={{paddingTop: "10px"}}>

                                        <div><UserAvatarPhoto photos={item.photos.small}/></div>
                                        <div>User name : {item.name}</div>
                                        <NavLink to={'/dialogs/' + item.id}>
                                            <button onClick={() => dispatch(startChatThunk(item.id, item.name, item.photos.small))}>Start Chat</button>
                                        </NavLink>
                                        <hr style={{marginTop: "10px"}}/>
                                    </div>
                                </div>
                            )}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default RecentDialogs;
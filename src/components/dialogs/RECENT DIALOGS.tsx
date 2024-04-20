import React, {useEffect, useState} from 'react';
import UsersSearchForm from "../users/UsersSearchForm";
import UserAvatarPhoto from "../users/users_avatars/UserAvatarPhoto";
import {NavLink} from "react-router-dom";
import {actionsDialogs, DialogsArrayType, fetchDialogsThunk, startChatThunk} from "../../redux/DialogsReducer";
import {useDispatch, useSelector} from "react-redux";
import {FilterType, getUsersThunkCreator, UsersArrayType, UsersComponentTypeArrays} from "../../redux/UsersReducer";
import {getUsersPageSelector} from "../../redux/selectors/UsersSelectors";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import "../../css/dialogs messenger/dialogs.css"
import "../../css/common css/formik.css"

type RecentDialogsPropsType = {
    dialogs: DialogsArrayType[],
    newMessageCount: number,
    pageSize: number,
    mob_toggleChat: Function
    show: boolean
}

const RecentDialogs: React.FC<RecentDialogsPropsType> = ({show, mob_toggleChat, dialogs, newMessageCount, pageSize}) => {

    const usersPage: UsersComponentTypeArrays = useSelector(getUsersPageSelector)
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()

    const [visibleDialogs, setVisibleDialogs] = useState<DialogsArrayType[]>([])
    const [userFound, setUserFound] = useState(false)

    useEffect(() => {
        const displayedDialogs = dialogs.slice(0, 10);
        setVisibleDialogs(displayedDialogs)
    },[dialogs])

    const onScrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
        const elementDialogs = event.currentTarget as HTMLDivElement;
        if (elementDialogs.scrollHeight - (elementDialogs.scrollTop + elementDialogs.clientHeight) < 20) {
            loadMoreDialogs()
        }
    }
    const loadMoreDialogs = () => {
        if(visibleDialogs.length === dialogs.length){
            return;
        }
        const startIndex = visibleDialogs.length
        const endIndex = startIndex + 10
        const nextDialogs = dialogs.slice(startIndex, endIndex)
        setVisibleDialogs((pevInitialDialogs ) => [...pevInitialDialogs, ...nextDialogs])
    }

    //Filter recent dialogs and users to find or start flood_chat
    const onFilterChanged = (filter: FilterType) => {
        // console.log('filter' , filter)
        filter = {...filter, friend: null, term: filter.term}
        dispatch(getUsersThunkCreator(1, pageSize, filter))
        if (filter.term) { //We are searching dialogs locally , because api did not provide req. data
            setUserFound(true)
            const filterDialogs = dialogs.filter((dialogs: DialogsArrayType) => dialogs.userName.includes(filter.term))
            // console.log('user found')
            dispatch(actionsDialogs.setAllDialogsAction(filterDialogs))
        } else {
            setUserFound(false)
            // console.log('user not found')
            dispatch(fetchDialogsThunk())
        }
        if (filter.term === "") {
            dispatch(actionsDialogs.setCurrentDialogsPageAction(1))
        }
    };

    const filteredUsers = usersPage.users.filter(({id}) => ! dialogs.some((e) => e.id === id) )
    return (
        <>
            <div
                className={`recent_dialogs_container ${show ? "" : "hide_dialogs_container"}`}
                onScroll={onScrollHandler}
                style={{
                    overflowY: "auto"
                }}
            >
                <div className="sticky">
                    <div className="dialogs_formik">
                        <UsersSearchForm onFilterChanged={onFilterChanged}/>
                    </div>
                </div>

                <div className="recent_dialogs_list">
                    {/*LIST OF DIALOGS*/}

                    {visibleDialogs
                        .sort((a: any, b: any) => b.hasNewMessages - a.hasNewMessages) //SORTING THE NEW MESSAGES FIRST
                        .map((dialog: DialogsArrayType) => (
                            <div className='recent_dialogs_item' key={dialog.id}>
                                <div className='user_profile_chat' style={{paddingTop: "10px"}}>
                                    <div className="dialogs_avatar"><UserAvatarPhoto photos={dialog.photos.small}/></div>
                                    <div className="user_credentials">
                                        <div>{dialog.userName} </div>

                                        <div>
                                            < NavLink to={'/dialogs/' + dialog.id}>
                                                <button onClick={() => {
                                                    dispatch(startChatThunk(dialog.id, dialog.userName, dialog.photos.small))
                                                    mob_toggleChat();
                                                }}>Start Chat
                                                </button>
                                            </NavLink>
                                        </div>
                                        {dialog.hasNewMessages && newMessageCount > 0 ? <div className='newMessage' style={{color: "red"}}>
                                            You got {dialog.newMessagesCount} new message
                                        </div> : <div className='newMessage'>No messages</div>
                                        }

                                    </div>


                                </div>
                            </div>
                        ))}


                    {/*LIST OF USERS*/}
                    {userFound &&
                        filteredUsers.map((item: UsersArrayType) =>
                            <div className='recent_dialogs_item' key={item.id}>
                                <div className='user_profile_chat' style={{ paddingTop: "10px" }}>

                                    <div className="dialogs_avatar"> <UserAvatarPhoto photos={item.photos.small} /></div>

                                    <div className="user_credentials">
                                        <div>Name: {item.name}</div>
                                        <NavLink to={'/dialogs/' + item.id}>
                                            <button onClick={() => {
                                                dispatch(startChatThunk(item.id, item.name, item.photos.small))
                                                mob_toggleChat();
                                            }}>Start Chat</button>
                                        </NavLink>
                                    </div>

                                    <hr style={{ marginTop: "10px" }} />
                                </div>
                            </div>
                        )}

                </div>
            </div>
        </>
    );
};

const RecentDialogsMemoComponent = React.memo(RecentDialogs)
export default RecentDialogsMemoComponent

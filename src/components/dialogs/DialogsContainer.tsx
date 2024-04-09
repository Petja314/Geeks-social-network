import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { actionsDialogs, DialogsStateTypes, fetchDialogsThunk, newMessageReceivedThunk, refreshMessagesThunk } from "../../redux/DialogsReducer";
import { FilterType, getUsersThunkCreator } from "../../redux/UsersReducer";
import { getCurrentPageSelector, getUsersFilterSelector } from "../../redux/selectors/UsersSelectors";
import '../../css/dialogs messenger/dialogs.css'
import { compose } from "redux";
import { WithAuthRedirect } from "../../hoc/WithAuthRedirect";
import DialogsChat from "./DialogsChat";
import RecentDialogs from "./RECENT DIALOGS";
import { RootState } from "../../redux/Redux-Store";
import { ThunkDispatch } from "redux-thunk";

import checkInnerWidth from '../../common/helpers/checkInnerWidth';

const DialogsContainer = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const {
        dialogs,
        newMessageCount,
        friendIdLocal,
        currentPageChat,
        pageSize,
        currentDialogsPage,
        pageSizeDialogs,
        pagesTotalCount,
        selectedUser,
        messages
    }: DialogsStateTypes = useSelector((state: RootState) => state.messagesPage)

    const [prevNewMessageValue] = useState<number>(0);
    const filter: FilterType = useSelector(getUsersFilterSelector)
    const currentPage: number = useSelector(getCurrentPageSelector)

    const [showRecentDialogs, setShowRecentDialogs] = useState<boolean>(true);


    // FETCH ALL DIALOGS
    useEffect(() => {
        dispatch(fetchDialogsThunk())
        dispatch(newMessageReceivedThunk())
        dispatch(actionsDialogs.setCurrentDialogsPageAction(1))// FIRST RENDER - FIRST PAGE
        if (currentDialogsPage === 1 && currentDialogsPage) {
            dispatch(getUsersThunkCreator(currentPage, pageSize, filter));
        }
        const pollingInterval = setInterval(async () => {
            // CALLING API GET REQUEST NEW MESSAGE RECEIVED? TO TRACK THE STATE IF THERE IS ANY NEW MESSAGES FROM USER. IF THERE IS , WE ARE FETCHING DIALOGS AND REFRESHING MESSAGES ONCE!
            dispatch(newMessageReceivedThunk())
        }, 55000) // api call interval time - 5000
        return () => {
            clearInterval(pollingInterval) // clear interval in different components
        }
    }, [newMessageCount])

    // CALL THE API ONLY WHEN NEW MESSAGE COMES UP FROM USER!
    useEffect(() => {
        if (newMessageCount !== prevNewMessageValue) { // compare the last count msg. to new message , if new message was sent , call the api
            dispatch(fetchDialogsThunk())
            dispatch(refreshMessagesThunk(friendIdLocal, currentPageChat, pageSize))
            if (filter.term === "") { //When the new message received , set the first dialogs page!
                dispatch(actionsDialogs.setCurrentDialogsPageAction(1))
            }
            console.log('refreshing dialogs...')
        }
    }, [newMessageCount])

    const mob_toggleChat = () => {
        if (checkInnerWidth(850)) {
            setShowRecentDialogs(!showRecentDialogs);
        }
    }

    return (
        <div className="dialogs_container" >

            <h2>Messenger</h2>
            <div className="dialogs_section">
                <RecentDialogs
                    pageSizeDialogs={pageSizeDialogs}
                    dialogs={dialogs}
                    newMessageCount={newMessageCount}
                    pageSize={pageSize}
                    currentDialogsPage={currentDialogsPage}
                    filter={filter}
                    mob_toggleChat={mob_toggleChat}
                    show={showRecentDialogs}
                />
                <DialogsChat
                    friendIdLocal={friendIdLocal}
                    currentPageChat={currentPageChat}
                    pageSize={pageSize}
                    pagesTotalCount={pagesTotalCount}
                    selectedUser={selectedUser}
                    messages={messages}
                    mob_toggleChat={mob_toggleChat}
                />

            </div>
        </div>
    )
};


const DialogsContainerMemoComponent = React.memo(DialogsContainer)
export default compose(
    WithAuthRedirect
)(DialogsContainerMemoComponent)






import React, {useEffect, useState} from 'react';
import styles from "./users.module.css";
import classnames from "classnames"
import {getUsersThunkCreator, UsersComponentTypeArrays} from "../redux/UsersReducer";
import {useDispatch, useSelector} from "react-redux";
import {getUsersFilterSelector} from "../redux/UsersSelectors";


type PaginationUsersType = {
    totalUsersCount : number
    pageSize : number
    currentPage : number
}
const PaginationUsers = (props: PaginationUsersType) => {
    const dispatch : any = useDispatch()
    const filter = useSelector(getUsersFilterSelector)
    const onPageChange = (pageNumber: number) => {
        dispatch(getUsersThunkCreator(pageNumber, props.pageSize,filter))
    }
    let pagesCount = Math.ceil(props.totalUsersCount / props.pageSize)
    let pages = []
    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i)
    }


    let portionSize = 10
    let portionCount = Math.ceil(pagesCount / portionSize)
    let [portionNumber, setPortionNumber] = useState(1)
    let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1
    let rightPortionPageNumber = portionNumber * portionSize

    useEffect(()=>setPortionNumber(Math.ceil(props.currentPage/portionSize)), [props.currentPage]);


    return (
        <div>

            {portionNumber > 1 &&
                <button onClick={() => {
                    setPortionNumber(portionNumber - 1)
                }}> PREVIOUS </button>
            }

            {pages
                .filter(p => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
                .map((p) => {
                    return <span className={classnames({
                        [styles.selectedPage]: props.currentPage === p
                    })}
                                 key={p}
                                 onClick={() => {
                                    onPageChange(p)
                                 }}>{p}
                    </span>
                })}
            {portionCount > portionNumber &&
                <button onClick={() => setPortionNumber(portionNumber +1) }> NEXT </button>
            }

        </div>
    );
};

export default PaginationUsers;
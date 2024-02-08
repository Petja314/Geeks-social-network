import React, {useEffect, useState} from 'react';
import arrow_right from "../../assets/images/icons/Arrow Right.png"
import arrow_left from "../../assets/images/icons/Arrow Left.png"
import "../../css/pagination.css"


type PaginationUsersType = {
    totalUsersCount: number
    pageSize: number
    currentPage: number
    onPageChange?: (value: number) => void
}
const PaginationUsers = (props: PaginationUsersType) => {
    const onPageChange = (pageNumber: number) => {
        if (props.onPageChange) {
            props.onPageChange(pageNumber); // Call the callback function passed from the parent to not call the thunks here (to prevent render both thunks)
        }
    }


    let pagesCountUsers = Math.ceil(props.totalUsersCount / props.pageSize)
    let pages = []
    for (let i = 1; i <= pagesCountUsers; i++) {
        pages.push(i)
    }

    let portionSize = 10
    let portionCount = Math.ceil(pagesCountUsers / portionSize)
    let [portionNumber, setPortionNumber] = useState(1)
    let leftPortionPageNumber = (portionNumber - 1) * portionSize + 1
    let rightPortionPageNumber = portionNumber * portionSize

    useEffect(() => setPortionNumber(Math.ceil(props.currentPage / portionSize)), [props.currentPage]);
    // console.log('pages', props.currentPage)
    return (
        <div className="pagination_container" >


            <div style={{display: "flex", gap: "20px"}}>

                <div>
                    {/*PREVIOUS PAGE BUTTON*/}
                    {props.currentPage > 1 &&
                        <button onClick={() => onPageChange(props.currentPage - 1)}><img src={arrow_left} alt="previous page"/></button> // PREV PAGE
                    }
                </div>
                <div>
                    {portionNumber > 1 &&
                        <button onClick={() => {
                            setPortionNumber(portionNumber - 1)
                        }}> ... </button> // PORTION PAGE -10 PAGE PORTIONS
                    }
                </div>

                <div className="pages_section">
                    {pages
                        .filter(p => p >= leftPortionPageNumber && p <= rightPortionPageNumber)
                        .map((p) => {
                            return <span
                                key={p}
                                onClick={() => {
                                    onPageChange(p)
                                }}>
                            <span className="pages" style={{margin: "0 auto", paddingRight: "5px", cursor: "pointer"}}>
                                {/*, color : p === props.currentPage ? "green" : "black ," ,*/}
                                {p}
                            </span>

                    </span>
                        })}
                </div>


                <div>
                    {portionCount > portionNumber &&
                        <button onClick={() => setPortionNumber(portionNumber + 1)}> ... </button> // PORTION PAGE +10 PAGE PORTIONS
                    }
                </div>
                <div>
                    {/*NEXT PAGE BUTTON*/}
                    {props.currentPage >= 1 && props.currentPage < pagesCountUsers
                        &&
                        <button onClick={() => onPageChange(props.currentPage + 1)}><img src={arrow_right} alt="next page"/></button> //NEXT PAGE
                    }
                </div>
            </div>


        </div>
    );
};

export default PaginationUsers;



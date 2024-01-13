//USEEFFECT TEST NET
import React, {useEffect, useState} from 'react';
import axios from "axios";

type SearchUserType = {
    login: string
}
type  SearchResult = {
    items: SearchUserType[]
}
type UsersType = {
    login: string
    id: number
    avatar_url: string
    followers: number
}

// 1 endpoint :
// https://api.github.com/search/users?q=it-kamasutra
// 2 endpoint :
// https://api.github.com/users/it-kamasutra

// SPLITTED VERSION OF DIMYCH
type SearchPropsType = {
    value: string
    onSubmit: (fixedValue: string) => void
}
type UsersListPropsType = {
    term: string
    onUserSelect: (user: SearchUserType) => void
}
type UserDetailsPropsType = {
    user: SearchUserType | null,
}


const EffectTestComponent = () => {
    const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null);
    let initialSearchState = 'it-kamasutra';
    const [searchTerm, setSearchTerm] = useState(initialSearchState);

    console.log('SELECTED USER ' , selectedUser)

    return (
        <div>
            <Search
                value={searchTerm}
                onSubmit={(value: string) => {
                    setSearchTerm(value);
                }}
            />
            <UsersList term={searchTerm} onUserSelect={setSelectedUser} />

            <Timer
                selectedUser={selectedUser}
            />
            <button onClick={() => setSearchTerm(initialSearchState)}>reset</button>
        </div>
    );
};

export const Timer = (props : any) => {
    const [seconds, setSeconds] = useState(10);
    // const [timerStarted, setTimerStarted] = useState(false)

    useEffect(() => {
        console.log('TICK')
        if ( seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [seconds]);

    useEffect(() => {
        if (props.selectedUser) {
            document.title = props.selectedUser.login;
            setSeconds(10)
        }
    }, [props.selectedUser]);

    // console.log('timer started' , timerStarted)
    console.log('TIMER' , seconds)
    return (
        <div>

            {props.selectedUser && seconds > 0   && (
                <>
                    <div style={{"color" : "blue"}} >Count Down Time : {seconds}</div>
                    <UserDetails user={props.selectedUser}/>
                </>
            )
            }
        </div>
    )
}
export const Search = (props: SearchPropsType) => {
    const [tempSearch, setTempSearch] = useState('')
    const [btnDisable, setBtnDisable] = useState(false);
    useEffect(() => {
        setTempSearch(props.value)

    }, [props.value])


    //VERSION 1
    // let isButtonDisabled = tempSearch === props.value
    //VERSION 2
    useEffect(() => {
        setBtnDisable(tempSearch === props.value)
    }, [tempSearch, props.value])

    return (
        <div>
            <div>
                <input placeholder="search"
                       onChange={(event) => {
                           setTempSearch(event.currentTarget.value)
                       }}

                       value={tempSearch}/>
                <button
                    disabled={btnDisable}
                    onClick={() => props.onSubmit(tempSearch)}>find
                </button>
            </div>
        </div>
    )
}
export const UsersList = (props: UsersListPropsType) => {
    const [users, setUsers] = useState<SearchUserType[]>([])
    useEffect(() => {
        axios
            .get<SearchResult>(`https://api.github.com/search/users?q=${props.term}`)
            .then(res => {
                setUsers(res.data.items)
            })
    }, [props.term])

    return (
        <div>
            <ul>
                {users.map((item: any) => <li key={item.id} onClick={() => props.onUserSelect(item)}> {item.login}</li>)}
            </ul>
        </div>
    )
}
export const UserDetails = (props: UserDetailsPropsType) => {
    const [userDetails, setUserDetails] = useState<UsersType | null>(null)

    useEffect(() => {
        if (!!props.user) {
            axios
                .get<UsersType>(`https://api.github.com/users/${props.user.login}`)
                .then(res => {
                    setUserDetails(res.data)
                    // setUsers(res.data.items)
                })
        }
    }, [props.user])


    return (
        <div>
            <div>
                {userDetails &&
                    <h3 style={{"color": "red"}}>
                        {userDetails.login}
                    </h3>
                }            </div>
            <div>Details:</div>

            <div style={{"border": "1px solid black"}}>
                {userDetails &&
                    <div>
                        id: {userDetails.id}
                        followers: {userDetails.followers}
                        <img src={userDetails.avatar_url} alt="avatar"/>
                    </div>
                }

            </div>

        </div>
    )
}

export default EffectTestComponent;

//VERSION 01 useEffect TEST

// const EffectTestComponent = () => {
//     const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null)
//     const [users, setUsers] = useState<SearchUserType[]>([])
//     const [tempSearch, setTempSearch] = useState('it-kamasutra')
//     const [searchTerm, setSearchTerm] = useState('it-kamasutra')
//     const [userDetails, setUserDetails] = useState<UsersType | null>(null)
//
//
//     useEffect(() => {
//         console.log('SYNC TAB TITLE')
//         if (selectedUser) {
//             document.title = selectedUser.login
//         }
//     }, [selectedUser])
//
//
//     useEffect(() => {
//         axios
//             .get<SearchResult>(`https://api.github.com/search/users?q=${searchTerm}`)
//             .then(res => {
//                 setUsers(res.data.items)
//             })
//     }, [searchTerm])
//
//
//     useEffect(() => {
//         console.log('SYNC USERS')
//         // fetchData(tempSearch)
//         if (!!selectedUser) {
//             axios
//                 .get<UsersType>(`https://api.github.com/users/${selectedUser.login}`)
//                 .then(res => {
//                     setUserDetails(res.data)
//                     // setUsers(res.data.items)
//                 })
//         }
//     }, [selectedUser])
//
//     console.log('searchTerm', searchTerm)
//     console.log('login user', selectedUser)
//
//
//     return (
//         <div>
//
//             <div>
//                 <input placeholder="search" onChange={(event) => setTempSearch(event.currentTarget.value)} value={tempSearch}/>
//                 <button onClick={() => setSearchTerm(tempSearch)}>find</button>
//             </div>
//
//             <ul>
//                 {users.map((item: any) => <li key={item.id} onClick={() => setSelectedUser(item)}> {item.login}</li>)}
//             </ul>
//
//             <h2>Username</h2>
//             <div>
//                 {userDetails &&
//                     <h3 style={{"color" : "red"}} >
//                         {userDetails.login}
//                     </h3>
//                 }            </div>
//
//             <div>Details:</div>
//
//             <div style={{"border": "1px solid black"}}>
//                 {userDetails &&
//                     <div>
//                       id:   {userDetails.id}
//                        followers:  {userDetails.followers}
//                         <img src={userDetails.avatar_url} alt="avatar"/>
//                     </div>
//                 }
//             </div>
//
//         </div>
//     );
// };
//
// export default EffectTestComponent;



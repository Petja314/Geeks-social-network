import robot1 from "../../../../assets/images/robots_images/robot-a4.png";
import robot2 from "../../../../assets/images/robots_images/robot-a5.png";
import robot3 from "../../../../assets/images/robots_images/robot-b1.png";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {fetchPostsThunk, ResponseTestAPIDataType, setUnverifiedUserIDThunk} from "../../../../redux/MyPostsReducer";
import {RootState} from "../../../../redux/Redux-Store";

interface UsePostsFetchUsersProps {
    idUserURL: number | null;
}
const usePostFetchUsers = ({ idUserURL }: UsePostsFetchUsersProps) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();

    useEffect(() => {
    const simulateGetRequestAsync = async () => {
        await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 100)); // Simulating a delay
        // Simulate the response data
        const responseData : Array<ResponseTestAPIDataType>  = [
            {id: 1, idUserURL, title: 'USER Post 1', content: 'USER comments 1...', likes: 0, image: robot1},
            {id: 2, idUserURL, title: 'USER Post 2', content: 'USER comments 2...', likes: 0, image: robot2},
            {id: 3, idUserURL, title: 'USER Post 3', content: 'USER comments 3...', likes: 0, image: robot3},
            {id: 4, idUserURL, title: 'USER Post 3', content: 'USER comments 3...', likes: 0, image: robot3},
            {id: 5, idUserURL, title: 'USER Post 3', content: 'USER comments 3...', likes: 0, image: robot3},
            {id: 6, idUserURL, title: 'USER Post 3', content: 'USER comments 3...', likes: 0, image: robot3},
            {id: 7, idUserURL, title: 'USER Post 3', content: 'USER comments 3...', likes: 0, image: robot3},
            {id: 8, idUserURL, title: 'USER Post 3', content: 'USER comments 3...', likes: 0, image: robot3},
            {id: 9, idUserURL, title: 'USER Post 3', content: 'USER comments 3...', likes: 0, image: robot3},
            // Add more data as needed
        ];
        return responseData;
    };
        // debugger
        dispatch(setUnverifiedUserIDThunk(Number(idUserURL)))
        //Simulate of get request call
        simulateGetRequestAsync().then((responseData) => {
            // debugger
            dispatch(fetchPostsThunk(responseData))
        })
    }, [idUserURL]);
};

export default usePostFetchUsers;
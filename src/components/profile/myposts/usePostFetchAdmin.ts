import robot1 from "../../../assets/images/robots_images/robot-a4.png";
import robot2 from "../../../assets/images/robots_images/robot-a5.png";
import robot3 from "../../../assets/images/robots_images/robot-b1.png";
import robot4 from "../../../assets/images/robots_images/robot-b2.png";
import robot5 from "../../../assets/images/robots_images/robot-b3.png";
import robot6 from "../../../assets/images/robots_images/robot-b4.png";
import robot7 from "../../../assets/images/robots_images/robot-b5.png";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {fetchPostsThunk, ResponseTestAPIDataType, setUserIdThunk} from "../../../redux/MyPostsReducer";
import {RootState} from "../../../redux/Redux-Store";

interface UsePostsFetchProps {
    userId: number | null;
}

const usePostFetchAdmin = ({ userId }: UsePostsFetchProps) => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch();

    useEffect(() => {
        dispatch(setUserIdThunk(userId));
        const simulateGetRequestAsync = async () => {
            await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 100));
            const responseData: Array<ResponseTestAPIDataType> = [
                {id: 1, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot1},
                {id: 2, userId, title: 'Post 2', content: 'Some comments 2...', likes: 0, image: robot2},
                {id: 3, userId, title: 'Post 3', content: 'Some comments 3...', likes: 0, image: robot3},
                {id: 4, userId, title: 'Post 4', content: 'Some comments 4...', likes: 0, image: robot4},
                {id: 5, userId, title: 'Post 5', content: 'Some comments 4...', likes: 0, image: robot5},
                {id: 6, userId, title: 'Post 6', content: 'Some comments 4...', likes: 0, image: robot6},
                {id: 7, userId, title: 'Post 1', content: 'Some comments 1...', likes: 0, image: robot7},
                // Add more data as needed
            ];
            return responseData;
        };

        simulateGetRequestAsync().then((responseData) => {
            dispatch(fetchPostsThunk(responseData));
        });
    }, [userId, dispatch]);
};

export default usePostFetchAdmin;
import React, {useEffect} from 'react';
import instanceNews, {newsAPI} from "../../api/NewsAPI";
const News = () => {

    useEffect(() => {
        const fetchData = async () => {
                const response = await newsAPI.getAllNews()
                console.log(response.data);
                // Handle the response data as needed
        };
        fetchData();
    }, []);


    return (
        <div>
            <h2>NEWS API</h2>

            <div>

            </div>

        </div>
    );
};

export default News;
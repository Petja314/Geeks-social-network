
import axios from "axios";

const apiKey = "pub_371574195f18a75c520c47302a0cd9139c92f";

const instanceNews = axios.create({
    baseURL: "https://newsdata.io/api/1",
    params: {
        apikey: apiKey,
    },
});

export const newsAPI = {
        getAllNews() {
            return instanceNews.get('/news', {
                params: {
                    q: 'technology', // Example keyword, adjust as needed
                },
            });
        }

}


export default instanceNews;





import axios from "axios";

const apikey  = process.env.REACT_APP_API_KEY_NEWS

const instanceNews = axios.create({
    baseURL: "https://www.alphavantage.co/",
    params: {
        apikey: apikey,
    },
});
export const newsAPI = {
        getAllNews() {
            return instanceNews.get('/query?function=NEWS_SENTIMENT&topics=technology&limit=50');
        }
}
export default instanceNews;




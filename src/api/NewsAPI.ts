
import axios from "axios";

const apiKey = "f282371cea4c40f78c09e297f574ea11";
// https://newsapi.org/v1/articles?source=the-verge&apiKey=f282371cea4c40f78c09e297f574ea11


const instanceNews = axios.create({
    baseURL: "https://newsapi.org/v1/",
    params: {
        apikey: apiKey,
    },
});

export const newsAPI = {
        getAllNews() {
            return instanceNews.get('articles?source=the-verge');
        }

}



export default instanceNews;



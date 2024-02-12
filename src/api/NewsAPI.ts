import axios from "axios";
import {NewsArrayTypes} from "../components/news/News";

const apikey = process.env.REACT_APP_API_KEY_NEWS

const instanceNews = axios.create({
    baseURL: "https://newsapi.org/v2",
    params: {
        apiKey: apikey,
    },
});
export const newsAPI = {
    getAllNews(pageSize : number , page : number) {
        return instanceNews.get<newsApiResponseType>(`/everything?q=technology&pageSize=${pageSize}&page=${page}`);
    }
}
export default instanceNews;


type newsApiResponseType = {
    articles : NewsArrayTypes[]
    status : string
    totalResults : number
}
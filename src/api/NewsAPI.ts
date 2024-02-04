import axios, {AxiosResponse} from "axios";
import {NewsItems} from "../components/news/News";

const apikey = process.env.REACT_APP_API_KEY_NEWS

const instanceNews = axios.create({
    baseURL: "https://www.alphavantage.co/",
    params: {
        apikey: apikey,
    },
});
export const newsAPI = {
    getAllNews(): Promise<AxiosResponse<{ feed: NewsItems[] }>> {
        return instanceNews.get<newsApiResponseType>('/query?function=NEWS_SENTIMENT&topics=technology&limit=50');
    }
}
export default instanceNews;


type newsApiResponseType = {
    feed: NewsItems[],
    items: string

}
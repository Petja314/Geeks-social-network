import React, {useState} from 'react';
import '../../css/news.css';
import {newsAPI} from '../../api/NewsAPI';
import img_is_coming from '../../assets/images/img_in_progress/img_is_coming.jpg';
import InfiniteScroll from "react-infinite-scroll-component";
import {compose} from "redux";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";
import Preloader from "../../common/preloader/Preloader";
import {NavLink} from "react-router-dom";
import RobotsAvatars from "../../assets/images/robots_images/RobotsAvatars";
import {localhost_response} from "../../api/news_api/news";


export type NewsArrayTypes = {
    "source": {
        "id": string,
        "name": string
    },
    "author": string,
    "title": string,
    "description": string,
    "url": string,
    "urlToImage": string,
    "publishedAt": string,
    "content": string
}
const News = () => {
    const fake_data = localhost_response // FAKE DATA NOT FROM API (API CAN BE USED ONLY IN LOCAL HOST)
    const [data, setData] = useState<NewsArrayTypes[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1)
    const pageSize: number = 10;


    const scrollHandler = async () => {
        setLoading(true);
        setPage((prevPage) => prevPage + 1)
        const response = await newsAPI.getAllNews(pageSize, page + 1);
        console.log('response', response)
        const newData = response.data.articles.map((item: any) => item)
        localStorage.setItem('NewsDataApi', JSON.stringify([...data, ...newData]))
        setData([...data, ...newData])
        setLoading(false);
    };

    const determineGridSpan = (index: number) => {
        return index % 5 < 2 ? 'span 3' : 'span 2';
    };
    return (
        <div className="news_container">
            <InfiniteScroll
                style={{overflow: 'hidden'}}
                dataLength={data.length}
                next={scrollHandler}
                // hasMore={data.length === 100 ? false : true} // data.length 100-120 posts is the limit by api!
                hasMore={fake_data.length === fake_data.length ? false : true} // FAKE DATA STOP
                loader={<h4>{loading}</h4>}
            >

                <h2>NEWS API</h2>
                <section className="news-section">
                    {fake_data.map((item: any, index: number) => (
                        // <article className={storyCard(index)} key={index}>
                        <article style={{gridColumn: determineGridSpan(index)}} className={`story-card_${index + 1}`} key={index}>
                            <a href={item.url}>
                                <div className="title_wrapper">{item.title}</div>
                                <div className={`image-wrapper ${index % 5 < 2 ? 'span-3' : 'span-2'}`}>
                                    <a href="" className={index % 5 < 2 ? 'span-3' : 'span-2'}>
                                     <span className="img_span">
                                         <NavLink to={item.url}>
                                         <img src={item.urlToImage !== null ? item.urlToImage : img_is_coming} alt="post image"/>
                                         </NavLink>
                                     </span>
                                    </a>
                                    <span>
                                     <div className="tag">
                                        <div>{item.publishedAt}</div>
                                         </div>
                                    </span>
                                </div>
                                <div className="meta">
                                    <div className="profile">
                                        <div className="profile-container">
                                            <RobotsAvatars/>
                                        </div>
                                        <div className="author">
                                            {item.author}
                                        </div>
                                    </div>
                                    <div className="source_name">
                                        {item.source.name}
                                    </div>
                                </div>
                            </a>
                        </article>
                    ))}

                </section>
                {loading &&
                    <div className="news_pre_loader">
                        <Preloader isFetching={true}/>
                    </div>
                }
                <div style={{textAlign: "center"}}>
                </div>
            </InfiniteScroll>
        </div>
    );
};

const NewsMemoComponent = React.memo(News)
export default compose(
    WithAuthRedirect
)(NewsMemoComponent)



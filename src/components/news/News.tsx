import React, {useEffect, useState} from 'react';
import './news.css';
import {newsAPI} from '../../api/NewsAPI';
import {robot_img_array} from '../../assets/images/robots_images/robot_array';
import img_is_coming from '../../assets/images/img_in_progress/img_is_coming.jpg';
import InfiniteScroll from "react-infinite-scroll-component";
import {compose} from "redux";
import {WithAuthRedirect} from "../../hoc/WithAuthRedirect";

type Topics = {
    topic: string,
    relevance_score: number
}
type TickerType = {
    ticker: string,
    relevance_score: number,
    ticker_sentiment_score: number,
    ticker_sentiment_label: string
}
export type NewsItems = {
    title: string,
    url: string,
    time_published: string,
    authors: [string],
    summary: string,
    banner_image: string,
    source: string,
    category_within_source: string,
    source_domain: string,
    topics: Topics[],
    overall_sentiment_score: number,
    overall_sentiment_label: string,
    ticker_sentiment: TickerType[]
}

const News = () => {
    const [data, setData] = useState<NewsItems[]>([]);
    const [endIndex, setEndIndex] = useState<number>(10); // Initial page size
    const [loading, setLoading] = useState<boolean>(false);
    const visibleData = data.slice(0, endIndex);

    // console.log('data', data)
    console.log('endIndex', endIndex)

    useEffect(() => {
        localStorage.removeItem('AlphaAvantageApi')
        const fetchDataApi = async () => {
            try {
                const storedResponse = localStorage.getItem('AlphaAvantageApi');
                if (storedResponse) {
                    const parsedResponse = JSON.parse(storedResponse);
                    setData(parsedResponse.feed);
                } else {
                    console.log('in')
                    const response = await newsAPI.getAllNews();
                    localStorage.setItem('AlphaAvantageApi', JSON.stringify(response.data));
                    // debugger
                    if(response.data.feed) {
                        setData(response.data.feed);
                    }
                    else {
                        alert('API ERROR - FREE LIMIT IS OVER COME BACK TOMORROW! ')
                    }
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };
        fetchDataApi();
    }, []);
    const scrollHandler = () => {
        setLoading(true);
        setEndIndex(prevEndIndex => prevEndIndex + 10);
        setLoading(false);
        if (data.length === endIndex) {
            setLoading(true);
        }
    };

    // const handleScroll = () => {
    //     const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //     const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    //     const clientHeight = window.innerHeight;
    //     if (scrollHeight - ( scrollTop + clientHeight ) < 100 && !loading) {
    //        fetchData();
    //     }
    //     console.log('handleScroll')
    //
    //     console.log('scrollTop' , scrollTop)
    // };
    // useEffect(() => {
    //     console.log('useEffect listener')
    //     window.addEventListener('scroll', handleScroll);
    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, [handleScroll]);
    // const storyCard = (index : any) => `story-card_${index + 1}`;
    const determineGridSpan = (index: number) => {
        return index % 5 < 2 ? 'span 3' : 'span 2';
    };
    console.log('visibleData', visibleData)

    return (
        <div>
            <InfiniteScroll
                style={{overflow: 'hidden'}}
                dataLength={visibleData.length} //This is important field to render the next data
                next={scrollHandler}
                hasMore={true}
                loader={<h4>{!loading}</h4>}
            >

                <div className="container">
                    <h2 style={{marginBottom: '30px', textAlign: 'center'}}>NEWS API</h2>
                    <section className="news-section">
                        {visibleData.map((item: NewsItems, index: number) => (
                            // <article className={storyCard(index)} key={index}>
                            <article style={{gridColumn: determineGridSpan(index)}} className={`story-card_${index + 1}`} key={index}>
                                <a href={item.url}>
                                    <div className="title_wrapper">{item.title}</div>
                                    <div className="image-wrapper">
                                        <a href="">
                    <span className="img_span">
                      <img src={item.banner_image !== null ? item.banner_image : img_is_coming} alt=""/>
                    </span>
                                        </a>
                                        <span>
                    <div className="tag">
                      <div>#{item.category_within_source !== 'n/a' ? item.category_within_source : 'top category'}</div>
                    </div>
                  </span>
                                    </div>
                                    <div className="meta">
                                        <div className="profile">
                                            <div className="profile-container">
                                                <img style={{maxWidth: '50px'}} src={robot_img_array[index]} alt=""/>
                                            </div>
                                            {item.authors}
                                        </div>
                                        <div style={{marginLeft: '50px'}}>{item.summary}</div>
                                    </div>
                                </a>
                            </article>
                        ))}
                    </section>
                    <div style={{textAlign: "center"}}>
                        {!loading && <p style={{fontSize: "100px"}}>Loading...</p>}
                    </div>
                </div>
            </InfiniteScroll>
        </div>
    );
};

const NewsMemoComponent = React.memo(News)
export default compose(
    WithAuthRedirect
)(NewsMemoComponent)



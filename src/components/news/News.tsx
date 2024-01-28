import React, {useEffect, useState} from 'react';
import './news.css'
import {newsAPI} from "../../api/NewsAPI";
import UserAvatarPhoto from "../users/UserAvatarPhoto";
import { robot_img_array} from "../assets/images/robot_array";
import {NavLink} from "react-router-dom";


const News = () => {
    const [data, setData] = useState<any>(null);
    const [newsData, setNewsData] = useState([])

    useEffect(() => {

        const fetchData = async () => {
            try {
                // Check if the data is already in localStorage
                const storedResponse = localStorage.getItem('NewsAPIResponse');

                if (storedResponse) {
                    const parsedResponse = JSON.parse(storedResponse);
                    // console.log('Using cached response:', parsedResponse);
                    setData(parsedResponse);
                } else {
                    // Data is not in localStorage, make a new API call
                    const response = await newsAPI.getAllNews();
                    console.log(response.data);
                    // Save the new data in localStorage
                    localStorage.setItem('NewsAPIResponse', JSON.stringify(response.data));
                    // Handle the response data as needed
                    setData(response.data);

                }
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (data) {
            setNewsData(data.articles)
        }
    }, [data])

    console.log('newsData', newsData)
    // console.log('data' , data)

    const storyCard = (index: any) => `story-card_${index + 1}`
    const robots_images = robot_img_array.map((robots : any,index : any) => robots )

    return (
        <div>

            <div className="container">

                <h2 style={{marginBottom: "30px", textAlign: "center"}}>NEWS API</h2>

                <section className="ejBEaK">
                    {newsData.map((item: any, index: any) => (
                        // <NavLink to={item.url} >
                            <article className={storyCard(index)}>
                                <div className="title_wrapper">{item.title}</div>
                                {/*<div className="card_reaction">card reaction</div>*/}
                                <div className="image-wrapper">
                                    <a href="">
                                    <span className="img_span">
                                        <img src={item.urlToImage} alt=""/>
                                    </span>
                                    </a>
                                    <span>
                                <div className="tag">
                                    <a href="">
                                        {item.publishedAt}
                                        {/*{item.publishedAt === null ? null  : "01.01.2100"}*/}
                                    </a>
                                </div>
                                    </span>

                                </div>

                                <div className="meta">
                                    <div className="profile" >
                                        <div className="profile-container">
                                            <img style={{maxWidth: "50px"}}  src={robot_img_array[index]} alt=""/>
                                        </div>
                                        {item.author}
                                    </div>

                                    <div style={{marginLeft : "50px"}} >{item.description }</div>

                                </div>
                            </article>
                        // </NavLink>


                    ))}


                </section>


            </div>

        </div>
    );
};

export default News;
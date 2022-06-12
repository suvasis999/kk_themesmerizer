import React, { useState, useEffect,useRef} from "react";
import {FetchSlider} from '../service/MemoAPI';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { IMAGE_URL } from "../service/BaseURL";
const CarouselPage = () => {
    const [sliderImage, setsliderImage] = useState([]);
    useEffect(() => {
        getData();
        
      }, []);
      const getData=async()=>{
        const response = await FetchSlider();
        
        setsliderImage(response.data.data);
      }
    return(
        <Carousel showThumbs={false}>
        {/*sliderImage.map((post,index) => (
            <div>
                <img src={IMAGE_URL + (post as any).attributes.cover.data.attributes.url} />
                <p className="legend">Legend 1</p>
                <p>{IMAGE_URL + (post as any).attributes.cover.data.attributes.url}</p>
            </div>
        ))*/}
        {sliderImage.map((post,index)=>(
            <div key={index}>
            <img src={IMAGE_URL + (post as any).attributes.image.data.attributes.url}  />
            <p className="legend">{(post as any).attributes.caption}</p>
             </div>
            
        ))}
        
        </Carousel>
    );
};

export default CarouselPage;
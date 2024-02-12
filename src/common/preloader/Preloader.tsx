import React from 'react';
import circle from "../../assets/images/spinning-circles.svg";
import "../../css/common css/preloader.css"


export type PreloaderType = {
    isFetching : boolean
}

const Preloader = (props : PreloaderType) => {
    return (
        <div className="preloader" >
            {props.isFetching ?  <img src={circle}/> : null}
        </div>
    );
};

export default Preloader;